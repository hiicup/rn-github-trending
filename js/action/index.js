import {onThemeChange} from "./theme"
import {onLoadPopularData,onLoadPopularMoreData} from "./popular"
import {onLoadTrendingData,onLoadTrendingMoreData} from "./trending"
import {createActionLoadData} from "./fav"
import {createActionLoadLanguage} from "./language"

export default {
    onThemeChange,

    onLoadPopularData,
    onLoadPopularMoreData,

    onLoadTrendingData,
    onLoadTrendingMoreData,

    createActionLoadData,

    createActionLoadLanguage
}