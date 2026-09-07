package com.auth.ums.requestmodels.Emails;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.core.io.Resource;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailAttachment {

    private String fileName;

    private Resource resource;

}