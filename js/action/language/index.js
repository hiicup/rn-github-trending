import LanguageDao from "../../expend/dao/LanguageDao";
import Types from "../types"

export function createActionLoadLanguage(flag) {
    return async dispatch => {
        try {
            const languages = await new LanguageDao(flag).fetch();
            dispatch({
                type: Types.LANGUAGE_LOAD_SUCCESS,
                languages: languages,
                flag: flag
            });
        } catch (e) {
            console.log(e);
        }
    }
}