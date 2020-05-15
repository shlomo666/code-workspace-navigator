const { app, Menu, screen } = require('electron');

exports.getContextMenu = ({
  primaryDisplayId,
  includeMinimized,
  setDisplayScreen
}) => {
  return Menu.buildFromTemplate([
    {
      label: 'Include Minimized',
      submenu: Menu.buildFromTemplate([
        {
          label: 'Yes',
          type: 'radio',
          click() {
            includeMinimized(true);
          },
          checked: true
        },
        {
          label: 'No',
          type: 'radio',
          click() {
            includeMinimized(false);
          }
        }
      ])
    },
    {
      label: 'Active Display Screen',
      submenu: Menu.buildFromTemplate(
        screen.getAllDisplays().map((display) => ({
          label: `screen ${display.id}${
            display.id === primaryDisplayId ? ' (Main)' : ''
          }`,
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
