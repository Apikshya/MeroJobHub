package com.auth.ums.responsemodels.user;

public interface UserCountProjection {

    Long getTotalUsers();

    Long getTotalCustomers();

    Long getTotalCompanyAdmins();
}
