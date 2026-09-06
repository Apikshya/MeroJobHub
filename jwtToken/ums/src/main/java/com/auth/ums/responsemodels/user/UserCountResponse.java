package com.auth.ums.responsemodels.user;

import lombok.Data;

@Data
public class UserCountResponse {

    private Long totalUsers;
    private Long totalCustomers;
    private Long totalCompanyAdmins;

}
