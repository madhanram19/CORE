import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080/" }),
  endpoints: (builder) => ({

    getUsers: builder.query({
      query: () => "users",
      providesTags: ["Admin"],
    }),

    getSingleUser: builder.query({
      query: ({ id }) => ({
        url: `admin/getSingleUser/${id}`,
      }),
      invalidatesTags: ['Admin'],
    }),

    addContent: builder.mutation({
      query: (contentData) => ({
        url: 'admin/contents',
        method: 'POST',
        body: contentData,
      }),
      invalidatesTags: ["Admin"],
    }),

    getContent: builder.query({
      query: () => "admin/getContents",
      providesTags: ["Admin"],
    }),

    getContentByID: builder.query({
      query: (id) => `admin/getcontent/${id}`,
      invalidatesTags: ["Admin"],
    }),

    updateContentById: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `admin/updatecontent/${id}`,
        method: 'POST',
        body: { updatedData },
      }),
      invalidatesTags: ['Admin'],
    }),

    registerSingledata: builder.query({
      query: ({ id }) => `admin/registerSingledata/${id}`,
      invalidatesTags: ["Admin"],
    }),


    adminloginData: builder.mutation({
      query: (body) => ({
        url: 'admin/adminlogin',
        method: 'POST',
        body: body
      }),
      invalidatesTags: ['Admin'],
    }),

    getTwoFactorAuthentication: builder.mutation({
      query: (body) => ({
        url: 'admin/twoFactorGetCode',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Admin']
    }),
    // twoFactorVerify: builder.mutation({
    //   query: (body) => ({
    //     url: 'admin/twoFactorVerify',
    //     method: 'POST',
    //     body
    //   }),
    //   invalidatesTags: ['Admin']
    // }),
    disableTwoFactorVerify: builder.mutation({
      query: (body) => ({
        url: 'admin/disableTwoFactor',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Admin']
    }),

    // userregiterData: builder.query({
    // query: () => ({
    //     headers:{
    //         Authorization:`Bearer ${token}`
    //     },
    //     method: 'GET',
    //     url:'/admin/registerlist'
    // }),
    // providesTags: ['Task'], }),

    adminchangepasswordData: builder.mutation({
      query: (body) => ({
        url: 'admin/adminpasswordchange',
        method: 'POST',
        body: body
      }),
      invalidatesTags: ['Admin'],
    }),

    oldPattern: builder.mutation({
      query: (body) => ({
        url: 'admin/oldPattern ',
        method: 'POST',
        body: body
      }),
      invalidatesTags: ['Admin'],
    }),
    newPattern: builder.mutation({
      query: (body) => ({
        url: 'admin/updatePattern',
        method: 'POST',
        body: body
      }),
      invalidatesTags: ['Admin'],
    }),
    forgotPattern: builder.mutation({
      query: (body) => ({
          url: 'admin/forgotpattern',
          method: 'POST',
          body: body
      }),
      invalidatesTags: ['Admin'],
  }),
    forgetPasswordVerifymail: builder.mutation({
      query: (body) => ({
        url: 'admin/verifyEmail',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Admin'],
    }),
    loginTwoFactorVerify: builder.mutation({
      query: (body) => ({
        url: 'admin/LoginTwoFactorVerify',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Admin']
    }),
    setNewPassword: builder.mutation({
      query: (body) => ({
        url: 'admin/setpassword',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Admin']
    }),
    // setNewPattern: builder.mutation({
    //   query: (body) => ({
    //     url: 'admin/setpattern',
    //     method: 'POST',
    //     body
    //   }),
    //   invalidatesTags: ['Admin']
    // }),


getKycList: builder.query({
  query: () => "admin/kycList",
  providesTags: ["Admin"],
}),

getKycData: builder.query({
  query: (id) => `admin/singleKycData/${id}`,
  providesTags: ["Admin"]
}),
ApproveKyc: builder.mutation({
  query: (body) => ({
      url: "admin/KycApprove",
      method: 'POST',
      body
  }),
  invalidatesTags: ['Admin'],
}),
RejectKyc: builder.mutation({
  query: (body) => ({
      url: "admin/KycReject",
      method: 'POST',
      body
  }),
  invalidatesTags: ['Admin'],
}),
addplan: builder.mutation({
  query: (body) => ({
      url: 'admin/stakingplan',
      method: 'POST',
      body
  }),
  invalidatesTags: ['Admin']
}),

// planData: builder.query({
// query: () => ({
// method: 'GET',
// url:'admin/planlist'
// }),
// providesTags: ['Admin'], }),

getplan: builder.mutation({
query: (body) => ({
  url: 'admin/getplan',
  method: 'POST',
  body
}),
invalidatesTags: ['Admin']
}),
updateplan: builder.mutation({
query: (body) => ({
  url: 'admin/updateplan',
  method: 'POST',
  body
}),
invalidatesTags: ['Admin']
}),
planData: builder.query({
  query: () => ({
      method: 'GET',
      url:'admin/planlist'
  }),
  providesTags: ['Admin'],
}),
getAllFaqQuery: builder.mutation({
  query: (body) => ({
      url: 'admin/getAllFaqData',
      method: 'POST',
      body
  }),
  invalidatesTags: ['Admin']
}),
handleCreateFAQ: builder.mutation({
  query: (body) => ({
      url: 'admin/createFaq',
      method: 'POST',
      body
  }),
  invalidatesTags: ['Admin']
}),
getSingleFaqQueryData: builder.mutation({
  query: (body) => ({
      url: 'admin/singleData',
      method: 'POST',
      body
  }),
  invalidatesTags: ['Admin']
}),
deleteFaqQueryData: builder.mutation({
  query: (body) => ({
      url: 'admin/deleteFaqData',
      method: 'DELETE',
      body
  }),
  invalidatesTags: ['Admin']
}),
getSiteSettingsURL: builder.mutation({
  query: (body) => ({
    url: 'admin/getURLData',
    method: 'POST',
    body,
  }),
  invalidatesTags: ['Admin'],
}),
handleSiteSettinsURLUpdate: builder.mutation({
  query: (body) => ({
    url: 'admin/URLUpdates',
    method: 'POST',
    body,
  }),
  invalidatesTags: ['Admin'],
}),
getUsersKyc: builder.query({
  query: () => ({
    url: `admin/getUsersKyc`,
    method: 'GET',
  }),
  invalidatesTags: [{ type: 'Admin' }],
}),
updateSingeRecordInKyc: builder.mutation({
  query: (updatedData) => ({
    url: `admin/updateSingeRecordInKyc`,
    method: 'POST',
    body: updatedData,
  }),
  invalidatesTags: [{ type: 'Admin' }],
}),
updateAllRecordsInKyc: builder.mutation({
  query: (updatedData) => ({
    url: `admin/updateAllRecordsInKyc`,
    method: 'POST',
    body: updatedData,
  }),
  invalidatesTags: [{ type: 'Admin' }],
}),
buyplanData: builder.query({
  query: (body)=> ({
      method: 'GET',
      url: 'admin/buyplanlist'
  }), 
  providesTags: ['Admin']
})

}),

    
})

  








export const {
  useGetUsersQuery, useGetUsersKycQuery,useUpdateAllRecordsInKycMutation,useUpdateSingeRecordInKycMutation, useBuyplanDataQuery,useGetSiteSettingsURLMutation, useHandleSiteSettinsURLUpdateMutation, useDeleteFaqQueryDataMutation, useGetAllFaqQueryMutation, useGetSingleFaqQueryDataMutation, useHandleCreateFAQMutation, useAddplanMutation,useGetplanMutation,useUpdateplanMutation, usePlanDataQuery, useForgotPatternMutation, useGetSingleUserQuery,useGetKycDataQuery, useApproveKycMutation,useGetKycListQuery,useRejectKycMutation, useLoginTwoFactorVerifyMutation,useAddContentMutation, useGetContentQuery, useGetContentByIDQuery, useForgetPasswordVerifymailMutation,  useOldPatternMutation, useNewPatternMutation, useSetNewPatternMutation,
  useUpdateContentByIdMutation, useAdminloginDataMutation,
  useGetTwoFactorAuthenticationMutation,
  useTwoFactorVerifyMutation, useAdminchangepasswordDataMutation,  useDisableTwoFactorVerifyMutation, useSetNewPasswordMutation
} = adminApi;
