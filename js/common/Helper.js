export default class Helper {
    /**
     * 判断两个一维数组是否相等
     * @param arr1
     * @param arr2
     * @returns {boolean}
     */
    static isArrayEqual(arr1, arr2) {

        if (!arr1 || !arr2r) {
            return false;
        }

        if (arr1.length !== arr2.length) {
            return false;
        }

        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }

        return true;
    }
}