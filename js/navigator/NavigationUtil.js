export default class NavigationUtil {
    static navigation = null;
    static resetHomePage(params){
        const navigation = NavigationUtil.getNavigation(params);
        navigation.navigate("Main");
    }

    static goback(params){
        const navigation = NavigationUtil.getNavigation(params);
        console.log("navigation",navigation);
        navigation.goBack();
    }

    static getNavigation(params){

        if(params !== undefined && params.navigation){
            return params.navigation;
        }

        return NavigationUtil.navigation;
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