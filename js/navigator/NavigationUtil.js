export default class NavigationUtil {
    static navigation = null;
    static resetHomePage(params){
        const {navigation} = params;
        navigation.navigate("Main");
    }

    static goback(params){
        const {navigation} = params;
        navigation.goBack();
    }


    static gotoPage(params,pageName){
        const {navigation} = params;

        if(!navigation){
            console.log("navigation can not be null.");
            return;
        }

        navigation.navigate(pageName,{...params})
    }

}