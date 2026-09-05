package com.auth.ums.responsemodels.ProfilePicture;

import com.auth.ums.responsemodels.BaseDTO;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ProfilePictureDTO extends BaseDTO {

    @JsonProperty("id")
    private Long id;

    @JsonProperty("file_name")
    private String fileName;

    @JsonProperty("file_path")
    private String filePath;

    @JsonProperty("is_current")
    private Boolean isCurrent;
}
