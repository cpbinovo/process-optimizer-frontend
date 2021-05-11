import { createMuiTheme, Theme } from "@material-ui/core";
import { brown, cyan, deepOrange, teal } from "@material-ui/core/colors";
import { Overrides } from "@material-ui/core/styles/overrides";
declare module '@material-ui/core/styles/createPalette' {
  interface Palette {
    custom: {
      background: PaletteColor
      textInsideBox: PaletteColor
    }
  }
  interface PaletteOptions {
    custom?: {
      background: PaletteColorOptions
      textInsideBox: PaletteColorOptions
    }
  }
}

const overrides: Overrides = {
  MuiTableCell: {
    sizeSmall: {
      padding: "0 2px 0 2px",
    }
  },
  MuiSelect: {
    select: {
      paddingBottom: 4,
    }
  },
  MuiListItem: {
    root: {
      paddingTop: 0,
      paddingBottom: 0,
    }
  }
}
declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    sizes: {
      mainWidthMin: number
      mainWidthMax: number
    }
  }
  
  interface ThemeOptions {
    sizes?: {
      mainWidthMin?: number
      mainWidthMax?: number
    }
  }
}

type CustomColours = {
  primary: string
  secondary: string
  backPrimary: string
  backSecondary: string
  textInsideBox: string
}

const createCustomTheme = (custom: CustomColours): Theme => {
  return createMuiTheme({
    overrides,
    sizes: {
      mainWidthMin: 1200,
      mainWidthMax: 1400,
    },
    palette: {
      primary: {
        main: custom.primary,
      },
      secondary: {
        main: custom.secondary,
      },
      custom: {
        background: {
          main: 'linear-gradient(90deg, ' + custom.backPrimary + ' 30%,' + custom.backSecondary + ' 100%)',
        },
        textInsideBox: {
          main: custom.textInsideBox,
        },
      }
    }
  });
}

const teals: CustomColours = {
  primary: teal[800],
  secondary: teal[100],
  backPrimary: teal[700],
  backSecondary: teal[400],
  textInsideBox: '#fff',
}

const cyans: CustomColours = {
  primary: cyan[800],
  secondary: cyan[100],
  backPrimary: cyan[700],
  backSecondary: cyan[600],
  textInsideBox: '#fff',
}

/*
bee:
#A67951
#734F2F
#BFA450
#F2DF80
#BE8037
*/

const bee: CustomColours = {
  primary: '#BE8037',
  secondary: '#F2DF80',
  backPrimary: '#A67951',
  backSecondary: '#A67951',
  textInsideBox: '#fff',
}

const beeLight: CustomColours = {
  primary: '#A67951',
  secondary: '#BFA450',
  backPrimary: '#FAFAFA',
  backSecondary: '#FAFAFA',
  textInsideBox: '#444',
}

/*
wood:
#732002
#BF9D5E
#F2D785
#0D3B29
#6379F2
*/

const wood: CustomColours = {
  primary: '#732002',
  secondary: '#BF9D5E',
  backPrimary: '#0D3B29',
  backSecondary: '#0D3B29',
  textInsideBox: '#fff',
}

/*
honey:
#03A688
#F2B705
#F28705
#A63F03
#A63F03
#400101
*/

const honey: CustomColours = {
  primary: '#A63F03',
  secondary: '#03A688',
  backPrimary: '#F28705',
  backSecondary: '#F2B705',
  textInsideBox: '#fff',
}

const blueGreen: CustomColours = {
  primary: 'rgba(0,121,145,1)',
  secondary: 'rgba(27,230,212,1)',
  backPrimary: 'rgba(0,121,145,1)',
  backSecondary: 'rgba(143,205,186,1)',
  textInsideBox: '#fff',
}


export const tealTheme: Theme = createCustomTheme(teals)
export const cyanTheme: Theme = createCustomTheme(cyans)
export const beeTheme: Theme = createCustomTheme(bee)
export const beeLightTheme: Theme = createCustomTheme(beeLight)
export const woodTheme: Theme = createCustomTheme(wood)
export const blueGreenTheme: Theme = createCustomTheme(blueGreen)
export const honeyTheme: Theme = createCustomTheme(honey)

export const theme: Theme = honeyTheme

