import {
    createStackNavigator,
    createSwitchNavigator
} from "react-navigation"
import WelcomePage from "../page/WelcomePage";
import HomePage from "../page/HomePage";
import DetailPage from "../page/DetailPage";
import StoreDemoPage from "../page/StoreDemoPage";

import {connect} from "react-redux";
import {
    createReactNavigationReduxMiddleware, createReduxContainer
} from "react-navigation-redux-helpers";

const InitNavigator = createStackNavigator({
    WelcomePage:{
        screen:WelcomePage,
        navigationOptions:{
            header:null
        }
    }
});

const MainNavigator = createStackNavigator({
    HomePage:{
        screen: HomePage,
        navigationOptions:{
            header:null
        }
    },
    DetailPage:{
        screen:DetailPage,
        navigationOptions:{
            // header:
        }
    },
    StoreDemoPage:{
        screen:StoreDemoPage,
        navigationOptions:{
            // header:
        }
    }
});

export const rootCom = 'Init';

export const RootNavigator = createSwitchNavigator({
    Init:InitNavigator,
    Main:MainNavigator
},{
    navigationOptions:{
        header:null // 禁用顶部菜单栏
    }
});
// 1
export const middleware = createReactNavigationReduxMiddleware(
    state=> state.nav,
    'root'
);
// 2
const AppWithNavigationState = createReduxContainer(RootNavigator,'root');
// 3
const mapStateToProps = state=>({
    state:state.nav
});
// 4
export default connect(mapStateToProps)(AppWithNavigationState);
