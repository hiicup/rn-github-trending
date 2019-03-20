export default class NavigationUtil {
    static navigation = null;
    static resetHomePage(params){
        const navigation = NavigationUtil.getNavigation(params);
        navigation.navigate("Main");
    }

    static goback(params){
        const navigation = NavigationUtil.getNavigation(params);
        navigation.goBack();
    }

    static getNavigation(params){
        return params.navigation || NavigationUtil.navigation;
    }

    static gotoPage(params,pageName){
        const navigation = NavigationUtil.getNavigation(params);

        if(!navigation){
            alert("navigation can not be null.");
            return;
        }

        navigation.navigate(pageName,{...params})
    }

}