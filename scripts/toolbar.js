// Copyright (c) 2017 kroppy. All rights reserved.
// Use of this source code is governed by a Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0) license
// that can be found at https://creativecommons.org/licenses/by-nc-nd/4.0/

// **********             TOOLBAR           ***************

// RESTORE LAST USED SEARCH TYPE (URL OR TITLE) IN TOOLBAR SEARCH
function RestoreToolbarSearchFilter() {
	chrome.runtime.sendMessage({command: "get_search_filter", windowId: CurrentWindowId}, function(response) {
		let ButtonFilter = document.getElementById("button_filter_type");
		if (response == "url") {
			ButtonFilter.classList.add("url");
			ButtonFilter.classList.remove("title");
		} else {
			ButtonFilter.classList.add("title");
			ButtonFilter.classList.remove("url");
		}
	});
}	

// RESTORE LAST ACTIVE SHELF (SEARCH, TOOLS, GROUPS, SESSION OR FOLDER) IN TOOLBAR
function RestoreToolbarShelf() {
	chrome.runtime.sendMessage({command: "get_active_shelf", windowId: CurrentWindowId}, function(response) {
		let filterBox = document.getElementById("filter_box");
		filterBox.setAttribute("placeholder", caption_searchbox);
		filterBox.style.opacity = "1";
		
		document.querySelectorAll(".on").forEach(function(s){
			s.classList.remove("on");
		});
		document.querySelectorAll(".toolbar_shelf").forEach(function(s){
			s.classList.add("hidden");
		});

		if (response == "search" && document.getElementById("button_search") != null) {
			document.getElementById("toolbar_search").classList.remove("hidden");
			document.getElementById("button_search").classList.add("on");
		}

		if (response == "tools" && document.getElementById("button_tools") != null) {
			document.getElementById("toolbar_shelf_tools").classList.remove("hidden");
			document.getElementById("button_tools").classList.add("on");
		}

		if (response == "groups" && document.getElementById("button_groups") != null) {
			document.getElementById("toolbar_shelf_groups").classList.remove("hidden");
			document.getElementById("button_groups").classList.add("on");
		}

		if (response == "backup" && document.getElementById("button_backup") != null) {
			document.getElementById("toolbar_shelf_backup").classList.remove("hidden");
			document.getElementById("button_backup").classList.add("on");
		}

		if (response == "folders" && document.getElementById("button_folders") != null) {
			document.getElementById("toolbar_shelf_folders").classList.remove("hidden");
			document.getElementById("button_folders").classList.add("on");
		}
		
		if (browserId != "F") {
			chrome.storage.local.get(null, function(storage) {
				let bak1 = storage["windows_BAK1"] ? storage["windows_BAK1"] : [];
				let bak2 = storage["windows_BAK2"] ? storage["windows_BAK2"] : [];
				let bak3 = storage["windows_BAK3"] ? storage["windows_BAK3"] : [];

				if (bak1.length && document.getElementById("#button_load_bak1") != null) {
					document.getElementById("button_load_bak1").classList.remove("disabled");
				} else {
					document.getElementById("button_load_bak1").classList.add("disabled");
				}
				
				if (bak2.length && document.getElementById("#button_load_bak2") != null) {
					document.getElementById("button_load_bak2").classList.remove("disabled");
				} else {
					document.getElementById("button_load_bak2").classList.add("disabled");
				}

				if (bak3.length && document.getElementById("#button_load_bak3") != null) {
					document.getElementById("button_load_bak3").classList.remove("disabled");
				} else {
					document.getElementById("button_load_bak3").classList.add("disabled");
				}

			});
		}
		
		RefreshGUI();
	});
}

// FUNCTION TO TOGGLE SHELFS AND SAVE IT
function ShelfToggle(mousebutton, button, toolbarId, SendMessage) {
	if (mousebutton == 1) {
		if (button.classList.contains("on")) {
			document.querySelectorAll(".on").forEach(function(s){
				s.classList.remove("on");
			});
			document.querySelectorAll(".toolbar_shelf").forEach(function(s){
				s.classList.add("hidden");
			});
		} else {
			document.querySelectorAll(".toolbar_shelf:not(#"+toolbarId+")").forEach(function(s){
				s.classList.add("hidden");
			});
			document.getElementById(toolbarId).classList.remove("hidden");
			chrome.runtime.sendMessage({command: "set_active_shelf", active_shelf: SendMessage, windowId: CurrentWindowId});
			document.querySelectorAll(".on:not(#"+button.id+")").forEach(function(s){
				s.classList.remove("on");
			});
			button.classList.add("on");
		}
		RefreshGUI();
	}
}

// ASSIGN MOUSE EVENTS FOR TOOLBAR BUTTONS, Buttons AND ToolbarShelfToggle, PARAMETERS DECIDE IF BUTTONS ARE CLICKABLE
// IN OPTIONS PAGE - TOOLBAR BUTTONS SAMPLES, MUST NOT CALL FUNCTIONS ON CLICKS, BUT STILL SHELFS BUTTONS MUST TOGGLE AND MOREOVER ON CLICK AND NOT ON MOUSEDOWN THIS IS WHERE ToolbarShelfToggleClickType="Click" IS NECESSARY
function SetToolbarEvents(CleanPreviousBindings, Buttons, ToolbarShelfToggle, ToolbarShelfToggleClickType) {

	let ClearSearch = document.getElementById("button_filter_clear");
	let FilterBox = document.getElementById("filter_box");
	
	if (ClearSearch != null && FilterBox != null) {
		if (CleanPreviousBindings) {
			FilterBox.removeEventListener("oninput", function(){});
			ClearSearch.removeEventListener("onmousedown", function(){});
		}	
		if (Buttons) {
			// FILTER ON INPUT
			FilterBox.oninput = function(event) {
				FindTab(this.value);
			}
			// CLEAR FILTER BUTTON
			ClearSearch.onmousedown = function(event) {
				if (event.which == 1) {
					this.style.opacity = "0";
					this.style.opacity = "0";
					this.setAttribute("title", "");
					FindTab("");
				}
			}
		}
	}

	document.querySelectorAll(".button").forEach(function(s){
		
		if (CleanPreviousBindings) {
			s.removeEventListener("onmousedown", function(){});
			s.removeEventListener("onclick", function(){});
			s.removeEventListener("click", function(){});
		}	
			
		if (ToolbarShelfToggle) {
			if (s.id == "button_search") {
				s.addEventListener(ToolbarShelfToggleClickType, function(event) {
					if (event.which == 1) {
						ShelfToggle(event.which, this, "toolbar_search", "search");
					}
				});
			}
			if (s.id == "button_tools") {
				s.addEventListener(ToolbarShelfToggleClickType, function(event) {
					if (event.which == 1) {
						ShelfToggle(event.which, this, "toolbar_shelf_tools", "tools");
					}
				});
			}
			if (s.id == "button_groups") {
				s.addEventListener(ToolbarShelfToggleClickType, function(event) {
					if (event.which == 1) {
						ShelfToggle(event.which, this, "toolbar_shelf_groups", "groups");
					}
				});
			}
			if (s.id == "button_backup") {
				s.addEventListener(ToolbarShelfToggleClickType, function(event) {
					if (event.which == 1) {
						ShelfToggle(event.which, this, "toolbar_shelf_backup", "backup");
					}
				});
			}
			if (s.id == "button_folders") {
				s.addEventListener(ToolbarShelfToggleClickType, function(event) {
					if (event.which == 1) {
						ShelfToggle(event.which, this, "toolbar_shelf_folders", "folders");
					}
				});
			}
		}
		
		if (Buttons) {
			// NEW TAB
			if (s.id == "button_new") {
				s.onclick = function(event) {
					if (event.which == 1) {
						OpenNewTab();
					}
				}
				s.onmousedown = function(event) {
					// DUPLICATE TAB
					if (event.which == 2) {
						event.preventDefault();
						let activeTab = document.querySelector("#"+active_group+" .active_tab") != null ? document.querySelector("#"+active_group+" .active_tab") : document.querySelector(".pin.active_tab") != null ? document.querySelector(".pin.active_tab") : null;
						if (activeTab != null) {
							chrome.tabs.duplicate(parseInt(activeTab.id), function(tab) {
								setTimeout(function() {
									if (activeTab.nextSibling != null) {
										activeTab.parentNode.insertBefore(document.getElementById(tab.id), activeTab.nextSibling);
									} else {
										activeTab.parentNode.appendChild(document.getElementById(tab.id));
									}							
									RefreshExpandStates();
									schedule_update_data++;
									RefreshCounters();
								}, 300);
							});
					}
					}
					// SCROLL TO TAB
					if (event.which == 3) {
						let activeTab = document.querySelector("#"+active_group+" .active_tab") != null ? document.querySelector("#"+active_group+" .active_tab") : document.querySelector(".pin.active_tab") != null ? document.querySelector(".pin.active_tab") : null;
						if (activeTab != null) {
							ScrollToTab(activeTab.id);
						}
					}
				}
			}
			// PIN TAB
			if (s.id == "button_pin") {
				s.onmousedown = function(event) {
					if (event.which == 1) {
						let Tabs = document.querySelectorAll(".pin.active_tab, .pin.selected_tab, #"+active_group+" .active_tab, #"+active_group+" .selected_tab");
						Tabs.forEach(function(s){
							chrome.tabs.update(parseInt(s.id), { pinned: Tabs[0].classList.contains("tab") });
						})
					}
				}				
			}
			// VERTICAL TABS OPTIONS
			if (s.id == "button_options") {
				s.onmousedown = function(event) {
					if (event.which == 1) {
						chrome.tabs.create({url: "options.html"});
					}
				}
			}

			// UNDO CLOSE
			if (s.id == "button_undo") {
				s.onmousedown = function(event) {
					if (event.which == 1) {
						chrome.sessions.getRecentlyClosed( null, function(sessions) {
							if (sessions.length > 0) {
								chrome.sessions.restore(null, function(restored) {});
							}
						});
					}
				}
			}

			// MOVE TAB TO NEW WINDOW (DETACH)
			if (s.id == "button_detach" || s.id == "button_move") {
				s.onmousedown = function(event) {
					if (event.which == 1) {
						if (document.querySelectorAll("#"+active_group+" .selected_folder").length > 0){
							let detach = GetSelectedFolders();
							Detach(detach.TabsIds, detach.Folders);
						} else {
							let tabsArr = [];
							document.querySelectorAll(".pin.selected_tab, .pin.active_tab, #"+active_group+" .selected_tab, #"+active_group+" .active_tab").forEach(function(s){
								tabsArr.push(parseInt(s.id));
								if (s.childNodes[4].childNodes.length > 0) {
									document.querySelectorAll("#"+s.childNodes[4].id+" .tab").forEach(function(t){
										tabsArr.push(parseInt(t.id));
									});
								}
							});
							Detach(tabsArr);
						}
					}
				}
			}

			// SHOW/HIDE GROUPS TOOLBAR
			if (s.id == "button_groups_toolbar_hide") {
				s.onmousedown = function(event) {
					if (event.which == 1) {
						GroupsToolbarToggle();
					}
				}
			}

			// GO TO PREVIOUS SEARCH RESULT
			if (s.id == "filter_search_go_prev") {
				s.onmousedown = function(event) {
					if (event.which == 1) {
						let filtered = document.querySelectorAll("#"+active_group+" .tab.filtered");
						if (filtered.length > 0) {
							document.querySelectorAll(".highlighted_search").forEach(function(s){
								s.classList.remove("highlighted_search");
							});
							if (SearchIndex == 0) {
								SearchIndex = filtered.length-1;
							} else {
								SearchIndex--;
							}
							filtered[SearchIndex].classList.add("highlighted_search");
							ScrollToTab(filtered[SearchIndex].id);
						}
					}
				}
			}
	
			// GO TO NEXT SEARCH RESULT
			if (s.id == "filter_search_go_next") {
				s.onmousedown = function(event) {
					if (event.which == 1) {
						let filtered = document.querySelectorAll("#"+active_group+" .tab.filtered");
						if (filtered.length > 0) {
							document.querySelectorAll(".highlighted_search").forEach(function(s){
								s.classList.remove("highlighted_search");
							});
							if (SearchIndex == filtered.length-1) {
								SearchIndex = 0;
							} else {
								SearchIndex++;
							}
							filtered[SearchIndex].classList.add("highlighted_search");
							ScrollToTab(filtered[SearchIndex].id);
						}
					}
				}
			}
				
			// NEW GROUP
			if (s.id == "button_new_group") {
				s.onmousedown = function(event) {
					if (event.which == 1) {
						AddNewGroup();
					}
				}
			}

			// REMOVE GROUP
			if (s.id == "button_remove_group") {
				s.onmousedown = function(event) {
					if (event.which == 1) {
						if (active_group != "tab_list") {
							GroupRemove(active_group, event.shiftKey);
						}
					}
				}
			}

			
			
			// EDIT GROUP
			if (s.id == "button_edit_group") {
				s.onmousedown = function(event) {
					if (event.which == 1) {
						if (active_group != "tab_list") {
							ShowGroupEditWindow(active_group);
						}
					}
				}
			}
			
			// EXPORT GROUP
			if (s.id == "button_export_group") {
				s.onmousedown = function(event) {
					if (event.which == 1) {
						ExportGroup(bggroups[active_group].name+".tt_group");
					}
				}
			}
			
			// IMPORT GROUP
			if (s.id == "button_import_group") {
				s.onmousedown = function(event) {
					if (event.which == 1) {
						let inputFile = ShowOpenFileDialog("file_import_group", ".tt_group");
						inputFile.onchange = function(event) {
							ImportGroup();
							// this.parentNode.removeChild(this);
						}
					}
				}
			}

			// NEW FOLDER
			if (s.id == "button_new_folder") {
				s.onmousedown = function(event) {
					if (event.which == 1) {
						AddNewFolder();
					}
				}
			}
			
			// RENAME FOLDER
			if (s.id == "button_edit_folder") {
				s.onmousedown = function(event) {
					if (event.which == 1) {
						if (document.querySelectorAll("#"+active_group+" .selected_folder").length > 0) {
							ShowRenameFolderDialog(document.querySelectorAll("#"+active_group+" .selected_folder")[0].id);
						}
					}
				}
			}
			// REMOVE FOLDERS
			if (s.id == "button_remove_folder") {
				s.onmousedown = function(event) {
					if (event.which == 1) {
						document.querySelectorAll("#"+active_group+" .selected_folder").forEach(function(s){
							RemoveFolder(s.id);
						});
					}
				}
			}
			// DISCARD TABS
			if (s.id == "button_unload" || s.id == "button_discard") {
				s.onmousedown = function(event) {
					if (event.which == 1) {
						if (document.querySelectorAll(".pin.selected_tab:not(.active_tab), #"+active_group+" .selected_tab:not(.active_tab)").length > 0) {
							DiscardTabs(
								Array.prototype.map.call(document.querySelectorAll(".pin:not(.active_tab), #"+active_group+" .selected_tab:not(.active_tab)"), function(s){
									return parseInt(s.id);
								})
							);
						} else {
							DiscardTabs(
								Array.prototype.map.call(document.querySelectorAll(".pin:not(.active_tab), .tab:not(.active_tab)"), function(s){
									return parseInt(s.id);
								})
							);
						}
					}
				}
			}
			// IMPORT BACKUP
			if (s.id == "button_import_bak") {
				s.onmousedown = function(event) {
					if (event.which == 1) {
						let inputFile = ShowOpenFileDialog("file_import_backup", ".tt_session");
						inputFile.onchange = function(event) {
							ImportSession();
							// this.remove();
						}
					}
				}
			}
			// EXPORT BACKUP
			if (s.id == "button_export_bak") {
				s.onmousedown = function(event) {
					if (event.which == 1) {
						ExportSession("Session.tt_session");
					}
				}
			}
			// MERGE BACKUP
			if (s.id == "button_import_merge_bak") {
				s.onmousedown = function(event) {
					if (event.which == 1) {
						let inputFile = ShowOpenFileDialog("file_import_merge_backup", ".tt_session");
						inputFile.onchange = function(event) {
							ImportMergeTabs();
							// this.remove();
						}						
					}
				}
			}

			// CHANGE FILTERING TYPE
			if (s.id == "button_filter_type") {
				s.onmousedown = function(event) {
					if (event.which == 1) {
						if (this.classList.contains("url")) {
							this.classList.remove("url");
							this.classList.add("title");
							chrome.runtime.sendMessage({command: "set_search_filter", search_filter: "title", windowId: CurrentWindowId});
						} else {
							this.classList.remove("title");
							this.classList.add("url");
							chrome.runtime.sendMessage({command: "set_search_filter", search_filter: "url", windowId: CurrentWindowId});
						}
						FindTab(document.getElementById("filter_box").value);
					}
				}
			}
			
			// SORT TABS
			// if (s.id == "button_sort") {
				// s.onmousedown = function(event) {
					// if (event.which == 1) {
						// SortTabs();
					// }
				// }
			// }
			// REPEAT SEARCH
			// if (s.id == "repeat_search") {
				// s.onmousedown = function(event) {
					// if (event.which == 1) {
						// FindTab(document.getElementById("filter_box").value);
					// }
				// }
			// }

			
			if (browserId != "F") {
				// BOOKMARKS
				if (s.id == "button_bookmarks") {
					s.onmousedown = function(event) {
						if (event.which == 1) {
							chrome.tabs.create({url: "chrome://bookmarks/"});
						}
					}
				}
				
				// DOWNLOADS
				if (s.id == "button_downloads") {
					s.onmousedown = function(event) {
						if (event.which == 1) {
							chrome.tabs.create({url: "chrome://downloads/"});
						}
					}
				}
				
				// HISTORY
				if (s.id == "button_history") {
					s.onmousedown = function(event) {
						if (event.which == 1) {
							chrome.tabs.create({url: "chrome://history/"});
						}
					}
				}
				
				// EXTENSIONS
				if (s.id == "button_extensions") {
					s.onmousedown = function(event) {
						if (event.which == 1) {
							chrome.tabs.create({url: "chrome://extensions"});
						}
					}
				}
				
				// SETTINGS
				if (s.id == "button_settings") {
					s.onmousedown = function(event) {
						if (event.which == 1) {
							chrome.tabs.create({url: "chrome://settings/"});
						}
					}
				}
				
				// LOAD BACKUPS
				if (s.id == "button_load_bak1" || s.id == "button_load_bak2" || s.id == "button_load_bak3") {
					s.onmousedown = function(event) {
						if (event.which == 1 && this.classList.contains("disabled") == false) {
							let BakN = (this.id).substr(15);
							chrome.storage.local.get(null, function(items) {
								if (Object.keys(items["windows_BAK"+BakN]).length > 0) { chrome.storage.local.set({"windows": items["windows_BAK"+BakN]}); }
								if (Object.keys(items["tabs_BAK"+BakN]).length > 0) { chrome.storage.local.set({"tabs": items["tabs_BAK"+BakN]}); alert("Loaded backup"); }
								chrome.runtime.sendMessage({command: "reload"}); chrome.runtime.sendMessage({command: "reload_sidebar"}); location.reload();
							});
						}
					}
				}
				
				
			}
		
		}

	});

}