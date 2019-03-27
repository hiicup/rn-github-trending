import Types from "../../action/types"
import LanguageDao from "../../expend/dao/LanguageDao";

const defaultState = {
    keys:[],
    languages:[]
};
export default function onAction(state = defaultState, action) {

    switch (action.type) {
        case Types.LANGUAGE_LOAD_SUCCESS:

            if (LanguageDao.isKey(action.flag)) {
                return {
                    ...state,
                    keys: action.languages
                };
            } else {
                return {
                    ...state,
                    languages: action.languages
                };
            }

        default:
            return state;
    }

}