import { AsyncStorage } from "react-native";

export const lang = async ()=>{
    try {
        const lang  = await AsyncStorage.getItem("lang")
        const strings = langs[lang || "fa"] 
        return strings
    } catch (error) {
        
    }
}

const langs = {
    fa:{
        isRTL:true,
        globals:{
            PRICE:"قیمت",
            PRICE_UNIT:"تومان",
            ADDRESS:"آدرس",
        },

        login:{
            RECEIVE_CODE : "دریافت کد",
            CONFIRM_CODE : 'کد تایید',
            LOGIN : "ورود"
        },

        main:{
            TITLE:"درخواست ها",
            TITLE2:"ماموریت",
            TITLE3:"امتیاز دهی",
            ACCEPT:"تایید",
            CANCEL:"رد درخواست"
        },

        log:{
            TITLE:"تاریخچه سرویس ها"
        },
        activeRequest:{
            CATEGORY:"گروه خدمتی",
            CANCEL:"لغو",
            FINISH:"اتمام ماموریت",
            ROUTING:"مسیریابی"
        }
    }
}