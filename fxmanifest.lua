fx_version 'cerulean'
games { 'gta5', 'rdr3' }

rdr3_warning 'I acknowledge that this is a prerelease build of RedM, and I am aware my resources *will* become incompatible once RedM ships.'

author 'Elena Winters'
description 'Debug tools used by myself for development. Compatible with FiveM and RedM'
version '23.6.26'

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
    'client/c_select_entity.js'



    -- 'twiliSettings.lua',
    -- 'twiliRender.lua',
    -- 'twiliNoLocals.lua',
    -- 'twiliControl.lua',
    -- 'twiliBounding.lua',
    -- 'twiliTesting.lua',
    -- 'twiliUtils.lua',
    -- 'twiliSelectEntity.lua',
    -- 'twiliDamageTest.js',
    -- 'twiliTesting.js'
}

