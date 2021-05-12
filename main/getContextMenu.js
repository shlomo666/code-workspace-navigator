const { app, Menu, screen } = require('electron');

exports.getContextMenu = ({ primaryDisplayId, setExcludeMinimized, setDisplayScreen }) => {
  return Menu.buildFromTemplate([
    {
      label: 'Exclude Minimized (this feature is not yet supported)',
      enabled: false,
      submenu: Menu.buildFromTemplate([
        {
          label: 'Yes',
          type: 'radio',
          click() {
            setExcludeMinimized(true);
          },
          checked: true
        },
        {
          label: 'No',
          type: 'radio',
          click() {
            setExcludeMinimized(false);
          }
        }
      ])
    },
    {
      label: 'Active Display Screen',
      submenu: Menu.buildFromTemplate(
        screen.getAllDisplays().map((display) => ({
          label: `screen ${display.id}${display.id === primaryDisplayId ? ' (Main)' : ''}`,
          type: 'radio',
          click() {
            setDisplayScreen(display.id);
          },
          checked: display.id === primaryDisplayId
        }))
      )
    },
    {
      label: 'Quit',
      click: () => app.quit()
    }
  ]);
};
