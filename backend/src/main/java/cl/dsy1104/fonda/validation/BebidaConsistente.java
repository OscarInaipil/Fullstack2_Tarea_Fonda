package cl.dsy1104.fonda.validation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = BebidaConsistenteValidator.class)
public @interface BebidaConsistente {

    String message() default "los atributos no corresponden al tipo de bebida";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}