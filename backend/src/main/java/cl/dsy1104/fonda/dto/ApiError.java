package cl.dsy1104.fonda.dto;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiError(String error, String mensaje, Map<String, String> campos) {

    public static ApiError de(String error, String mensaje) {
        return new ApiError(error, mensaje, null);
    }
}
