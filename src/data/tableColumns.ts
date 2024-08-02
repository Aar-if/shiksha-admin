import { DataType, SortDirection } from "ka-table";

export const getUserTableColumns = (t: any) => {

    return [
        {
          key: "name",
          title: t("FORM.NAME"),
          dataType: DataType.String,
          sortDirection: SortDirection.Ascend,
        },
        {
          key: "status",
          title: t("FORM.STATUS"),
          dataType: DataType.String,
          sortDirection: SortDirection.Ascend,
         //width: isMobile?160:null,
        },
       
      
        {
          key: "age",
          title: t("FORM.AGE"),
          dataType: DataType.String,
        //  width: 160,
        },
        {
          key: "gender",
          title: t("FORM.GENDER"),
          dataType: DataType.String,
        //  width: 160,
        },
        {
          key: "mobile",
          title: t("FORM.MOBILE_NUMBER"),
          dataType: DataType.String,
         // width: 160,
        },
        {
          key: "state",
          title: t("FORM.STATE"),
          dataType: DataType.String,
          sortDirection: SortDirection.Ascend,
         // width: 160,
        },
        {
          key: "district",
          title:t("FORM.DISTRICT"),
          dataType: DataType.String,
          sortDirection: SortDirection.Ascend,
        //  width: 160,
        },
      
        {
          key: "blocks",
          title: t("FORM.BLOCK"),
          dataType: DataType.String,
          sortDirection: SortDirection.Ascend,
        //  width: 160,
        },
        {
          key: "centers",
          title:  t("FORM.CENTER"),
          dataType: DataType.String,
          sortDirection: SortDirection.Ascend,
         // width: 160,
        },
        {
          key: "actions",
          title: t("FORM.ACTION"),
          dataType: DataType.String,
         // width: 160,
        },
      ];
}


export const getTLTableColumns = (t: any) => {
    return[
       
        {
            key: "name",
            title: t("FORM.NAME"),
            dataType: DataType.String,
            sortDirection: SortDirection.Ascend,
          },
          {
            key: "status",
            title: t("FORM.STATUS"),
            dataType: DataType.String,
            sortDirection: SortDirection.Ascend,
           //width: isMobile?160:null,
          },
         
        
          {
            key: "age",
            title: t("FORM.AGE"),
            dataType: DataType.String,
          //  width: 160,
          },
          {
            key: "gender",
            title: t("FORM.GENDER"),
            dataType: DataType.String,
          //  width: 160,
          },
        
          {
            key: "state",
            title: t("FORM.STATE"),
            dataType: DataType.String,
            sortDirection: SortDirection.Ascend,
           // width: 160,
          },
          {
            key: "district",
            title:t("FORM.DISTRICT"),
            dataType: DataType.String,
            sortDirection: SortDirection.Ascend,
          //  width: 160,
          },
        
          {
            key: "blocks",
            title: t("FORM.BLOCK"),
            dataType: DataType.String,
            sortDirection: SortDirection.Ascend,
          //  width: 160,
          },
       
          {
            key: "actions",
            title: t("FORM.ACTION"),
            dataType: DataType.String,
           // width: 160,
          },
      ];
}

