/** @jsx createElement */
import { createElement } from 'elliptical'
import { Application, Command, Directory, File } from 'lacona-phrases'
import { runApplescript, callSystem } from 'lacona-api'

export const Find = {
  extends: [Command],

  execute (result) {

    function reveal (path) {
      runApplescript({
        script:
        `
        set thePath to POSIX file "${path}"
        tell application "Finder" to reveal thePath
        `
      })
    }

    var callback = function(err, stdout, stderr) {
      var path = stdout.substring(0, stdout.length - 1);
      reveal(path)
    }

    if (result.discovered.app) {
      var cmd = `mdfind kMDItemCFBundleIdentifier = "${result.discovered.app.bundleId}"`
      callSystem({command: "/bin/bash", args: ['-c', cmd]}, callback)
    }
    else {
      var path = result.discovered.path
      reveal(path)
    }
  },

  describe () {
    return (
      <sequence>
        <literal text='Find ' />
        <choice id='discovered'>
          <Application id='app' />
          <Directory id='path' />
          <File id='path' />
        </choice>
      </sequence>
    )
  }
}

export default [Find]
