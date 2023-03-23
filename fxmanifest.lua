fx_version 'cerulean'
games { 'gta5', 'rdr3' }

rdr3_warning 'I acknowledge that this is a prerelease build of RedM, and I am aware my resources *will* become incompatible once RedM ships.'

author 'Elena Winters'
description 'Debug tools used by myself for development. Compatible with FiveM and RedM'
version '23.3.22'

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/index.css',
    'html/selector.js'
}

-- client_script 'twiliClient.lua'

client_scripts {
    'twiliSettings.lua',
    'twiliRender.lua',
    'twiliNoLocals.lua',
    'twiliControl.lua',
    'twiliBounding.lua',
    'twiliTesting.lua',
    'twiliUtils.lua',
    'twiliSelectEntity.lua'
}

