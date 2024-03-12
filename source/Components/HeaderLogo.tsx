
import * as React from 'react';
import { Button, Image, StyleSheet, Text, View,StatusBar } from 'react-native';
import {styled} from 'styled-components'
import { useHeaderHeight } from '@react-navigation/elements';

const LogoContainer = styled(View)`
  flex: 1;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: 'center';
`;

const Logo = styled(Image)`
  width: 40px;
  height: ${props => props.height ? `${props.height}px` : '50px'};
`;
 
function HeaderLogo() {
  const headerHeight = useHeaderHeight();
  console.log(headerHeight)
  return (
    <LogoContainer >
      <StatusBar barStyle={"light-content"} />
      <Logo
        height={headerHeight}
        source={require('../images/stock.png')}
      />
      {/* <Text style={{color: 'white', padding: 5, fontSize: 22}}>Home</Text> */}
    </LogoContainer>
  );
}

export default HeaderLogo