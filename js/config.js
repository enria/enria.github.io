var LAYOUT = {
    init_menu_width_percent: 20
}
var user = {
    github: {
        name: "enria",
        data_repo: "tree-markdown-note",
        data_root_path_sha: "8a8237d761cdb710783b1d159bf1c60b97305341",
        data_recursive:10
    }
}
var GITHUB_API = {
    url: {
        contents: "https://api.github.com/repos/" + user.github.name + "/" + user.github.data_repo + "/contents",
        tree:"https://api.github.com/repos/" + user.github.name + "/" + user.github.data_repo + "/git/trees/"+user.github.data_root_path_sha+"?recursive="+10
    }
}