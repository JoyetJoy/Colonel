import React, { useState } from 'react';
import { CrudMaster } from './CrudMaster';
import { useMastersStore } from '../../store/mastersStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { BRANCH } from '../../api/apis';
import ErrorPopup from '../popups/ErrorPopup';
import { newRequest } from '../../api';
import { usePopup } from '../../providers/PopupProvider';
import toast from 'react-hot-toast';

export function BranchesMaster() {
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [pageLimit, setPageLimit] = useState(10);
  const [loader, setLoader] = useState(false);
  const [errormsg, setErrormsg] = useState("");
  const [errorPopup, setErrorPopup] = useState(false);
  const queryClient = useQueryClient();
  const { showSuccess } = usePopup();
  const { branches, addBranch, updateBranch, deleteBranch } = useMastersStore();

  const { data: branchMasterList, isLoading, isError } = useQuery({
    queryKey: ["branchMasterList", currentPage, pageLimit, keyword],
    queryFn: () =>
      newRequest
        .get(BRANCH, {
          params: {
            keyword,
            page: currentPage,
            limit: pageLimit,
          },
        })
        .then((res) => res.data),
  });

  const columns = [
    { key: 'name', label: 'Branch Name' },
    { key: 'address', label: 'Address' },
    { key: 'location', label: 'Location' },
    { key: 'pincode', label: 'Pincode' }
  ];

  const formFields = [
    { name: 'name', label: 'Branch Name', type: 'text', required: true },
    { name: 'address', label: 'Address', type: 'text', required: true },
    { name: 'location', label: 'Location', type: 'text', required: true },
    { name: 'pincode', label: 'Pincode', type: 'number', required: true }
  ];

  const handleSave = async (data, id) => {
    try {
      setLoader(true);
      const payload = { ...data, pincode: Number(data.pincode) };
      const api = id ? `${BRANCH}/${id}` : BRANCH
      const method = id ? 'patch' : 'post'
      const res = await newRequest[method](api, payload);
      if (res?.data?.status) {
        setLoader(false);
        if (id) {
          toast.success(res?.data?.message);
        } else {
          showSuccess(res?.data?.message);
        }

        queryClient.invalidateQueries(["branchMasterList"]);
        return true;
      }
      setLoader(false);
      return false;
    } catch (error) {
      setLoader(false);
      console.log(error);
      setErrormsg(error?.response?.data?.error || "Something went wrong");
      setErrorPopup(true);
      return false;
    }
  };

  return (
    <>
      <ErrorPopup
        popupOpen={errorPopup}
        setPopupOpen={setErrorPopup}
        setError={setErrormsg}
        error={errormsg}
      />
      <CrudMaster
        title="Branches"
        columns={columns}
        data={branchMasterList?.data || []}
        formFields={formFields}
        onSave={handleSave}
        api={BRANCH}
        loader={loader}
        isLoading={isLoading}
        isError={isError}
        queryKey="branchMasterList"
        pagination={true}
        currentPage={currentPage}
        totalPages={branchMasterList?.pagination?.totalPage || 1}
        totalItems={branchMasterList?.pagination?.totalData || 0}
        onPageChange={(page) => setCurrentPage(page)}
        keyword={keyword}
        setKeyword={setKeyword}
      />
    </>
  );
}
