// material-ui
// import { useTheme } from '@mui/material/styles';
import { Image } from 'react-bootstrap';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
  // const theme = useTheme();

  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     * <img src={logo} alt="Berry" width="100" />
     *
     */
    <>
      {/* <h5 style={{
      fontFamily: 'Roboto, sans-serif',
      fontSize: '24px',
      fontWeight: 'bold',
      color: 'red',
      textTransform: 'uppercase'
    }}>
      Shop For Men
    </h5> */}
      <Image style={{ width: 60, height: 60 }} src="https://i.imgur.com/r5WRVvP.png" alt="Shop" />
      <h5 style={{ color: 'darkblue', fontFamily: "'Pacifico', cursive" }}>
        Sports Sh<span style={{ fontFamily: "'Material Icons'", fontSize: 'inherit' }}>op</span>
      </h5>
    </>
  );
};

export default Logo;