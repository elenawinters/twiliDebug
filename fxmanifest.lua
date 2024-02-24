fx_version 'cerulean'
games { 'gta5', 'rdr3' }

rdr3_warning 'I acknowledge that this is a prerelease build of RedM, and I am aware my resources *will* become incompatible once RedM ships.'

author 'Elena Winters'
description 'Debug tools used by myself for development. Compatible with FiveM and RedM'
version '23.10.19'

dependencies {
    'twiliCore'
}

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/index.css',
    'html/selector.js'
}

shared_scripts {
    '@twiliCore/shared/u_common.js'
}

-- client_script 'twiliClient.lua'

client_scripts {
    '@twiliCore/client/c_globals.js',
    'client/c_control.js',
    'client/c_render.js',
    'client/c_settings.js',
    'client/c_utils.js',
    'client/c_bounding.js',
    'client/c_select_entity.js',
    'client/c_weather.js',

    'client/tests/c_tow.js',

    'client/c_lists.js',

    'client/c_vehicle_bones.js'
}

server_scripts {
    'server/s_sync.js'
}

