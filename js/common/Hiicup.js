import {NativeModules} from "react-native"

const HiicupModule = NativeModules.HiicupModule;
export default {
    sayHello:(msg)=>{
        HiicupModule.sayHello(msg);
    },
    api:()=>{
        return HiicupModule.api();
    }

}