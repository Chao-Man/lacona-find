/** @jsx createElement */
import { createElement } from 'elliptical'
import { Application, Command, Directory, File } from 'lacona-phrases'
import { runApplescript } from 'lacona-api'
import { exec } from 'child_process'

export const Find = {
  extends: [Command],

  execute (result) {
    function reveal (path) {
      runApplescript({
        script:
        `
        tell application "Finder"
          reveal POSIX file "${path}" as text
          activate
        end tell
        `
      })
    }

    var callback = function(err, stdout, stderr) {
      console.log(stdout);
      var path = stdout.substring(0, stdout.length - 1);
      reveal(path)
    }

    if (result.discovered.app) {
      var path = result.discovered.app.path;
      reveal(path)
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

export const extensions = [Find]
