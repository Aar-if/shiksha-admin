import React, { useState, useEffect } from "react";
import KaTableComponent from "../components/KaTableComponent";
import { DataType } from "ka-table/enums";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { userList } from "../services/UserList";
import { getCohortList } from "../services/GetCohortList";
import HeaderComponent from "@/components/HeaderComponent";
import { useTranslation } from "next-i18next";
import { deleteUser } from "../services/DeleteUser";
import Pagination from "@mui/material/Pagination";
import DeleteUserModal from "@/components/DeleteUserModal";
import { SelectChangeEvent } from "@mui/material/Select";
import PageSizeSelector from "@/components/PageSelector";
import CustomModal from "@/components/CustomModal";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { showToastMessage } from "@/components/Toastify";
import Loader from "../components/Loader";
import glass from "../../public/images/empty_hourglass.svg";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { SortDirection  } from 'ka-table/enums';

type UserDetails = {
  userId: any;
  username: any;
  name: any;
  role: any;
  mobile: any;
  centers?: any;
  Programs?: any;
  age?:any;
  state?:any;
  district?:any;
  blocks?:any
};
type FilterDetails = {
  role: any;
  status: any;
  district?: any;
   state?: any;
   block?: any;
};

interface Cohort {
  cohortId: string;
  name: string;
  parentId: string | null;
  type: string;
  customField: any[];
}
interface UserTableProps {
    role: string;
    userType: string, 
    searchPlaceholder: string
  }
const columns = [
  // {
  //   key: "userId",
  //   title: "ID",
  //   dataType: DataType.String,
  // },
  {
    key: "name",
    title: "Name",
    dataType: DataType.String,
    sortDirection: SortDirection.Ascend,
    width: 160,
    
  },
  {
    key: "centers",
    title: "Centers",
    dataType: DataType.String,
    sortDirection: SortDirection.Ascend,
    width: 160,

  },
  // {
  //   key: "programs",
  //   title: "Programs",
  //   dataType: DataType.String,
  // },
  {
    key: "age",
    title: "Age",
    dataType: DataType.String,
    width: 160,

  },
  {
    key: "state",
    title: "State",
    dataType: DataType.String,
    sortDirection: SortDirection.Ascend,
    width: 160,

  },
  {
    key: "district",
    title: "District",
    dataType: DataType.String,
    sortDirection: SortDirection.Ascend,
    width: 160,

  },
  
  {
    key: "blocks",
    title: "Bocks",
    dataType: DataType.String,
    sortDirection: SortDirection.Ascend,
    width: 160,

  },
  {
    key: "actions",
    title: "Actions",
    dataType: DataType.String,
        width: 160,

  },
];

const UserTable: React.FC<UserTableProps> = ({ role , userType, searchPlaceholder}) => {
    const [selectedState, setSelectedState] = React.useState<string[]>([]);
  const [selectedStateCode, setSelectedStateCode] = useState("");
  const [selectedDistrict, setSelectedDistrict] = React.useState<string[]>([]);
  const [selectedDistrictCode, setSelectedDistrictCode] = useState("");
  const [selectedBlock, setSelectedBlock] = React.useState<string[]>([]);
  const [selectedBlockCode, setSelectedBlockCode] = useState("");
  const [selectedSort, setSelectedSort] = useState("Sort");
  const [pageOffset, setPageOffset] = useState(0);
  const [pageLimit, setPageLimit] = useState(10);
  const [pageSizeArray, setPageSizeArray] = React.useState<number[]>([]);
  const [data, setData] = useState<UserDetails[]>([]);
  const [cohortsFetched, setCohortsFetched] = useState(false);
  const { t } = useTranslation();
  const [pageSize, setPageSize] = React.useState<string | number>("10");
  const [sortBy, setSortBy] = useState(["createdAt", "asc"]);
  const [pageCount, setPageCount] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [confirmButtonDisable, setConfirmButtonDisable] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [loading, setLoading] = useState<boolean | undefined>(undefined);

  const [filters, setFilters] = useState<FilterDetails>({
    role: role,
    status: "active",
  });

  const handleChange = (event: SelectChangeEvent<typeof pageSize>) => {
    setPageSize(event.target.value);
    setPageLimit(Number(event.target.value));
  };

  const handlePaginationChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPageOffset(value - 1);
  };

  const PagesSelector = () => (
    <Pagination
      color="primary"
      count={pageCount}
      page={pageOffset + 1}
      onChange={handlePaginationChange}
    />
  );

  const PageSizeSelectorFunction = () => (
    <PageSizeSelector
      handleChange={handleChange}
      pageSize={pageSize}
      options={pageSizeArray}
    />
  );
  const handleStateChange = async (selected: string[], code: string[]) => {
    setSelectedDistrict([]);
    setSelectedBlock([]);


    setSelectedState(selected);
  
    if (selected[0] === "") {
      console.log("hii")
      setFilters({ role: role, status: "active" });
    } else {
     const stateCodes = code?.join(",");
      setSelectedStateCode(stateCodes);
      setFilters({ role: role, status: "active", state: stateCodes });
    }

    console.log("Selected categories:", typeof code[0]);
  };
  const handleFilterChange = async (event: SelectChangeEvent) => {
    console.log(event.target.value as string);
    setSelectedFilter(event.target.value as string);
  };

  const handleDistrictChange = (selected: string[], code: string[]) => {
    console.log("district")
    setSelectedBlock([]);
   setSelectedDistrict(selected);

    if (selected[0] === "") {
      setFilters({
        role: role,
        status: "active",
        state: selectedStateCode,
      });
    } else {
      const districts = code?.join(",");
      setSelectedDistrictCode(districts);
      setFilters({
        role: role,
        status: "active",
        state: selectedStateCode,
        district: districts,
      });
    }
    console.log("Selected categories:", selected);
  };
  const handleBlockChange = (selected: string[], code: string[]) => {
    setSelectedBlock(selected);
    if (selected[0] === "") {
      setFilters({
        role: role,
        status: "active",
        state: selectedStateCode,
        district:selectedDistrictCode
      });
    } else {
      const blocks = code?.join(",");
      setSelectedBlockCode(blocks);
      setFilters({
        role: role,
        status: "active",
        state: selectedStateCode,
        district: selectedDistrictCode,
        block:blocks
      });
    }
    console.log("Selected categories:", selected);
  };
  const handleSortChange = async (event: SelectChangeEvent) => {
    // let sort;
    if (event.target.value === "Z-A") {
      setSortBy(["name", "desc"]);
    } else if (event.target.value === "A-Z") {
      setSortBy(["name", "asc"]);
    } else {
      setSortBy(["createdAt", "asc"]);
    }

    setSelectedSort(event.target.value as string);
  };
  const handleEdit = (rowData: any) => {
    console.log("Edit row:", rowData);
    // Handle edit action here
  };

  const handleDelete = (rowData: any) => {

    setIsDeleteModalOpen(true);
    setSelectedUserId(rowData.userId);
    //const userData="";

    console.log("Delete row:", rowData.userId);
  };
  useEffect(() => {
    const fetchUserList = async () => {
      setLoading(true);
      try {
        const fields=[ "age",
        "districts",
        "states",
        "blocks"];
        const limit = pageLimit;
        const offset = pageOffset * limit;
        // const filters = { role: role , status:"active"};
        const sort = sortBy;
        console.log("filters", filters)
        const resp = await userList({ limit, filters, sort, offset , fields});
        const result = resp?.getUserDetails;
        // console.log(resp?.totalCount)
        if (resp?.totalCount >= 15) {
          setPageSizeArray([5, 10, 15]);
        } else if (resp?.totalCount >= 10) {
          setPageSize(resp?.totalCount);
          setPageSizeArray([5, 10]);
        } else if (resp?.totalCount >= 5 || resp?.totalCount < 5) {
          setPageSize(resp?.totalCount);
          setPageSizeArray([5]);
        }

        setPageCount(Math.ceil(resp?.totalCount / pageLimit));
         console.log(result)
        const finalResult= result.map((user: any) => {
          const ageField = user.customFields.find((field: any) => field.name === "age");
          const blockField = user.customFields.find((field: any) => field.name === "blocks");
          const districtField = user.customFields.find((field: any) => field.name === "districts");
          const stateField = user.customFields.find((field: any) => field.name === "states");


          return {
            userId: user.userId,
            username: user.username,
            name: user.name,
            role: user.role,
            mobile: user.mobile,
            age: ageField ? ageField.value : null,
            district: districtField ? districtField.value : null,
            state: stateField ? stateField.value : null,
            blocks: blockField ? blockField.value : null,
            // centers: null,
            // Programs: null,
          };
        });
        setData(finalResult);
        setLoading(false);
        setCohortsFetched(false);
      } catch (error: any) {
        setLoading(false);

        if (error?.response && error?.response.status === 404) {
          setData([]);
          //showToastMessage("No data found", "info");

        }

        console.log(error);
      }
    };
    fetchUserList();
  }, [pageOffset, pageLimit, sortBy, filters]);

  useEffect(() => {
    const fetchData = async () => {

      try{
       
        if (data.length === 0 || cohortsFetched)
        {
          return;  }
      const newData = await Promise.all(
        data.map(async (user) => {
          const response = await getCohortList(user.userId);
          const cohortNames = response?.result?.cohortData?.map(
            (cohort: Cohort) => cohort.name
          );

          return {
            ...user,
            centers: cohortNames,
          };

        })

      );

      setData(newData);
      setCohortsFetched(true);

      }
      catch(error: any)
      {
         console.log(error);
      }
      
      
    };

    fetchData();
  }, [data, cohortsFetched]);
  const handleCloseDeleteModal = () => {
    setSelectedReason("");
    setOtherReason("");
    setIsDeleteModalOpen(false);
  };
  const handleDeleteUser = async (category: string) => {
    try {
      console.log(selectedUserId);
      const userId = selectedUserId;
      const userData = {
        userData: [
          {
            reason: selectedReason,
            status: "archived",
          },
        ],
      };
      const response = await deleteUser(userId, userData);
      handleCloseDeleteModal();
    } catch (error) {
      console.log("error while deleting entry", error);
    }
  };

  const extraActions: any = [
    { name: "Edit", onClick: handleEdit, icon: EditIcon },
    { name: "Delete", onClick: handleDelete, icon: DeleteIcon },
  ];

  const userProps = {
    userType: userType,
    searchPlaceHolder:searchPlaceholder,
    selectedState: selectedState,
    selectedDistrict: selectedDistrict,
    selectedBlock: selectedBlock,
    selectedSort: selectedSort,
    handleStateChange: handleStateChange,
    handleDistrictChange: handleDistrictChange,
    handleBlockChange: handleBlockChange,
    handleSortChange: handleSortChange,
    selectedFilter: selectedFilter,
    handleFilterChange: handleFilterChange
  };

  return (
    <HeaderComponent {...userProps}>
       {loading ? (
                <Loader showBackdrop={true} loadingText={t("COMMON.LOADING")} />
              ): (  (data.length!==0 && loading===false  )? (  <KaTableComponent
                columns={columns}
                data={data}
                limit={pageLimit}
                offset={pageOffset}
                PagesSelector={PagesSelector}
                PageSizeSelector={PageSizeSelectorFunction}
                pageSizes={pageSizeArray}
                extraActions={extraActions}
                showIcons={true}
                onEdit={handleEdit}
                onDelete={handleDelete}
                
              />) : 
              ( loading===false &&   data.length===0 && ( 
                <Box display="flex" >
              <Image src={glass} alt="" />
              <Typography
              marginTop="10px"
              >
               {t("COMMON.NO_USER_FOUND")}    
              </Typography>
            </Box>)) )}

    
        {/* <KaTableComponent
          columns={columns}
          data={data}
          limit={pageLimit}
          offset={pageOffset}
          PagesSelector={PagesSelector}
          PageSizeSelector={PageSizeSelectorFunction}
          pageSizes={pageSizeArray}
          extraActions={extraActions}
          showIcons={true}
          onEdit={handleEdit}
          onDelete={handleDelete}
          
        /> */}
      <DeleteUserModal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        selectedValue={selectedReason}
        setSelectedValue={setSelectedReason}
        handleDeleteAction={handleDeleteUser}
        otherReason={otherReason}
        setOtherReason={setOtherReason}
        confirmButtonDisable={confirmButtonDisable}
        setConfirmButtonDisable={setConfirmButtonDisable}
      />
    </HeaderComponent>
  );
};

// export async function getStaticProps({ locale }: any) {
//   return {
//     props: {
//       ...(await serverSideTranslations(locale, ["common"])),
//     },
//   };
// }

export default UserTable;
