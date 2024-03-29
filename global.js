// GLOBAL VARIABLES
let browserId = navigator.userAgent.match("Opera|OPR") !== null ? "O" : (navigator.userAgent.match("Vivaldi") !== null ? "V" : (navigator.userAgent.match("Firefox") !== null ? "F" : "C"))
let opt = {};

let labels = {
    clear_filter: chrome.i18n.getMessage("caption_clear_filter"),
    loading: chrome.i18n.getMessage("caption_loading"),
    searchbox: chrome.i18n.getMessage("caption_searchbox"),
    ungrouped_group: chrome.i18n.getMessage("caption_ungrouped_group"),
    noname_group: chrome.i18n.getMessage("caption_noname_group")
};

// DEFAULTS NEEDED FOR START AND FOR OPTIONS PAGE
const DefaultToolbar = {
    toolbar_main: ["button_new", "button_pin", "button_undo", "button_search", "button_tools", "button_groups", "button_backup", "button_folders"],
    toolbar_search: ["button_filter_type", "filter_search_go_prev", "filter_search_go_next"],
    toolbar_shelf_tools: (browserId == "F" ? ["button_manager_window", "button_options", "button_unload", "button_detach", "button_reboot"] : ["button_manager_window", "button_options", "button_bookmarks", "button_downloads", "button_history", "button_settings", "button_extensions", "button_unload", "button_detach", "button_reboot"]),
    toolbar_shelf_groups: ["button_groups_toolbar_hide", "button_new_group", "button_remove_group", "button_edit_group", "button_import_group", "button_export_group"],
    toolbar_shelf_backup: (browserId == "F" ? ["button_import_bak", "button_import_merge_bak", "button_export_bak"] : ["button_import_bak", "button_import_merge_bak", "button_export_bak", "button_load_bak1", "button_load_bak2", "button_load_bak3"]),
    toolbar_shelf_folders: ["button_new_folder", "button_remove_folder", "button_edit_folder"]
};

const DefaultMenu = {
    all_entries: [["s_pin","menu_new_pin"],["s_newt","menu_new_tab"],["s_unpt","menu_unpin_tab"],["s_pit","menu_pin_tab"],["s_newf","menu_new_folder"],["s_renf","menu_rename_folder"],["s_delf","menu_delete_folder"],["s_dupt","menu_duplicate_tab"],["s_undclo","menu_undo_close_tab"],["s_bkt","menu_bookmark_tree"],["s_expat","menu_expand_tree"],["s_collt","menu_collapse_tree"],["s_expaa","menu_expand_all"],["s_colla","menu_collapse_all"],["s_deta","menu_detach_tab"],["s_rel","menu_reload_tab"],["s_unlo","menu_unload"],["s_unlt","menu_unload_tree"],["s_clo","menu_close"],["s_clot","menu_close_tree"],["s_cloo","menu_close_other"],["s_mut","menu_mute_tab"],["s_mutt","menu_mute_tree"],["s_unmu","menu_unmute_tab"],["s_unmut","menu_unmute_tree"],["s_mutot","menu_mute_other"],["s_unmutot","menu_unmute_other"],["s_newg","menu_new_group"],["s_reng","menu_rename_group"],["s_delg","menu_delete_group"],["s_delgclo","menu_delete_group_tabs_close"],["s_gunlo","menu_groups_unload"],["s_ghiber","menu_groups_hibernate"],["s_gtbcl","menu_group_tabs_close"],["s_gbk","menu_bookmark_group"],["s_mngr_wnd","menu_manager_window"],["s_tts","menu_treetabs_settings"]],
    pin:         [[  false,true          ],[   false,false         ],[    true,true            ],[   false,false        ],[   false,false            ],[   false,false               ],[   false,false               ],[    true,true                ],[      true,true                 ],[  false,false               ],[    false,false             ],[    false,false               ],[    false,false            ],[    false,false              ],[    true,true             ],[  false,true             ],[   false,false        ],[   false,false             ],[   true,false       ],[   false,false            ],[   false,true              ],[  false,false          ],[   false,false           ],[   false,false            ],[    false,false             ],[     true,true             ],[      false,true               ],[   false,false           ],[   false,false              ],[   false,false              ],[      false,false                         ],[    false,false               ],[     false,false                  ],[    false,false                  ],[  false,false                ],[       false,true                 ],[   true,true                    ]],
    tab:         [[  false,false         ],[   false,true          ],[    true,false           ],[   false,true         ],[    true,true             ],[   false, false              ],[   false,false               ],[    true,true                ],[      true,true                 ],[  false,true                ],[    false,false             ],[    false,false               ],[     true,true             ],[    false,true               ],[    true,true             ],[  false,true             ],[   false,false        ],[   false,false             ],[   true,true        ],[   false,false            ],[   false,true              ],[  false,false          ],[   false, false          ],[   false,false            ],[    false,false             ],[     true,true             ],[      false,true               ],[   false,false           ],[   false,false              ],[   false,false              ],[      false,false                         ],[    false,false               ],[     false,false                  ],[    false,false                  ],[  false,false                ],[       false,true                 ],[   true,true                    ]],
    folder:      [[  false,false         ],[   false,true          ],[   false,false           ],[   false,false        ],[   false,true             ],[    true,true                ],[   false,true                ],[   false,false               ],[     false,false                ],[   true,true                ],[    false,false             ],[    false,false               ],[     true,true             ],[    false,true               ],[    true,true             ],[  false,false            ],[    true,true         ],[  false,false              ],[  false,false       ],[   false,false            ],[   false,false             ],[  false,true           ],[   false,false           ],[   false,true             ],[    false,false             ],[    false,false            ],[      false,false              ],[   false,true            ],[   false,false              ],[   false,false              ],[      false,false                         ],[    false,false               ],[     false,false                  ],[    false,false                  ],[  false,false                ],[       false,true                 ],[   true,true                    ]],
    global:      [[  false,true          ],[   false,true          ],[   false,false           ],[   false,false        ],[   false,true             ],[   false,false               ],[   false,false               ],[   false,false               ],[      true,true                 ],[  false,false               ],[    false,false             ],[    false,false               ],[     true,true             ],[    false,true               ],[   false,false            ],[  false,false            ],[   false,false        ],[  false,false              ],[  false,false       ],[   false,false            ],[   false,false             ],[  false,false          ],[   false,false           ],[   false,false            ],[    false,false             ],[    false,false            ],[      false,false              ],[    true,true            ],[   false,false              ],[   false,false              ],[      false,false                         ],[    false,false               ],[     false,false                  ],[    false,false                  ],[   true,true                 ],[       false,true                 ],[   true,true                    ]],
    group:       [[  false,false         ],[   false,false         ],[   false,false           ],[   false,false        ],[   false,false            ],[   false,false               ],[   false,false               ],[   false,false               ],[     false,false                ],[  false,false               ],[    false,false             ],[    false,false               ],[    false,false            ],[    false,false              ],[   false,false            ],[  false,false            ],[   false,false        ],[  false,false              ],[  false,false       ],[   false,false            ],[   false,false             ],[  false,false          ],[   false,false           ],[   false,false            ],[    false,false             ],[    false,false            ],[      false,false              ],[   false,true            ],[   false,true               ],[   false,true               ],[      false,true                          ],[     true,true                ],[     false,true                   ],[     true,true                   ],[   true,true                 ],[       false,true                 ],[   true,true                    ]]
// name:       [[  false,false         ],[   false,false         ],[   false,false           ],[   false,false        ],[   false,false            ],[    false,false              ],[   false,false               ],[   false,false               ],[     false,false                ],[   false,false              ],[    false,false             ],[    false,false               ],[     false,false           ],[    false,false              ],[    false,false           ],[  false,false            ],[    false,false       ],[  false,false       ],[   false,false            ],[   false,false             ],[  false,false          ],[   false,false           ],[   false,false            ],[    false,false             ],[    false,false            ],[      false,false              ],[   false,false            ],[   false,false             ],[   false,false              ],[      false,false                         ],[    false,false               ],[     false,false                  ],[    false,false                  ],[  false,false                ],[       false,false                ],[   false,false                  ]]
};

const DefaultTheme = {
    ToolbarShow: true,
    ColorsSet: {},
    TabsSizeSetNumber: 2,
    TabsMargins: "2",
    theme_name: "untitled",
    theme_version: 4
};

const DefaultPreferences = {
    hide_other_groups_tabs_firefox: false,
    show_toolbar: true,
    skip_load: false,
    pin_attention_blinking: true,
    audio_blinking: true,
    pin_list_multi_row: true,
    append_pinned_tab: "last",
    always_show_close: false,
    never_show_close: false,
    allow_pin_close: false,
    append_child_tab: "bottom",
    append_child_tab_after_limit: "after",
    append_orphan_tab: "bottom",
    after_closing_active_tab: "below_seek_in_parent",
    append_tab_from_toolbar: "group_root",
    collapse_other_trees: false,
    open_tree_on_hover: true,
    promote_children: true,
    promote_children_in_first_child: true,
    max_tree_depth: -1,
    max_tree_drag_drop: true,
    switch_with_scroll: false,
    syncro_tabbar_tabs_order: true,
    show_counter_groups: true,
    show_counter_tabs: true,
    show_counter_tabs_hints: true,
    groups_toolbar_default: true,
    syncro_tabbar_groups_tabs_order: true,
    midclick_tab: "close_tab",
    dbclick_tab: "new_tab",
    dbclick_group: "new_tab",
    // dbclick_group_bar: "new_group",
    midclick_group: "nothing",
    midclick_folder: "nothing",
    dbclick_folder: "rename_folder",
    debug: false,
    orphaned_tabs_to_ungrouped: false,
    tab_group_regexes: [],
    move_tabs_on_url_change: "never",
    autosave_max_to_keep: 5,
    autosave_interval: 15
};

// GLOBAL FUNCTIONS
function GenerateRandomID() {
    let letters = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "K", "L", "M", "N", "O", "P", "R", "S", "T", "Q", "U", "V", "W", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "k", "l", "m", "n", "o", "p", "r", "s", "t", "q", "u", "v", "w", "y", "z"];
    let random = "";
    for (let letter = 0; letter < 14; letter++) { random += letters[Math.floor(Math.random() * letters.length)]; }
    return random;
}