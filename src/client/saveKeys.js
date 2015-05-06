declare('SaveKeys', function() {
	return {
		idnGameVersion: StrSha('version'),
		idnUserName: StrSha('name'),

		idnSettingsInternalInfoToConsole: StrSha('setIntInfoToConsole'),
		idnSettingsInternalWarningToConsole: StrSha('setIntWarningToConsole'),
		idnSettingsInternalLogContexts: StrSha('setIntLogContexts')
	};
});
