const theme = {
  colors: {
    paper: '#F5F5F5',
    primary: '#074a37',
    secondary: '#11bb8b',
    secondaryLight: '#15e0a6',
    text: '#172c39',
    backgroundBody: '#EDF1F5',
    backgroundBreadcrumbs: '#DEE6ED',
    signal: {
      danger: {
        paper: '#EF9A9A',
        text: '#B71C1C'
      },
      info: {
        paper: '#81D4FA',
        text: '#0288D1'
      },
      success: {
        paper: '#A5D6A7',
        text: '#388E3C'
      },
      warning: {
        paper: '#FFF59D',
        text: '#F57F17'
      }
    }
  },
  fontFamily: {
    monospace: '"Courier New", Courier, monospace',
    regular: '"Courier New", Courier, monospace',
  },
  fontSize: {
    base: 1.0,
    factor: 1.1
  },
  fontWeights: {
    regular: 300,
    bold: 500
  },
  lineHeights: {
    dense: 1,
    light: 1.2,
    regular: 1.4
  },
  radii: {
    regular: '0px',
    medium: '2px',
    large: '4px'
  }
}



var widgets = document.querySelectorAll("[data-tocco-widget]"); 
widgets.forEach(widget => widget.setAttribute("data-custom-theme", JSON.stringify(theme)))

