import { useForm } from "react-hook-form";
import ToastNotifications from "cogo-toast";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { useLocation, withRouter } from "react-router-dom";

import "../styles/Login.scss";
import "../styles/InputForm.css";

import Input from "./Input";
import Header from "./Header";
import Sidebar from "./SidebarD2";
import Typography from "./Typography";
import FooterHoriz from "./FooterHoriz";
import BaseBtn from "./Buttons/BaseBtn/BaseBtn";
import { useUser } from "../contexts/UserContext";
import useValidators from "../utils/useValidators";
import { setUserAuthData, postJsonData } from "../utils/AuthUtils";

const Login = ({ history }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { fetchUser, currentLanguage } = useUser();
  const [isEmailAuth, setEmailAuth] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm({ mode: "onSubmit" });
  const { email, password } = getValues();
  const { emailValidators, passwordValidators } = useValidators();

  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const response = await postJsonData("/login", {
        email,
        password,
        langId: currentLanguage.id
      });

      setUserAuthData({
        email,
        token: response.token
      });
      await fetchUser();
      if (location?.search && location.search?.split("redirect=")?.length > 1) {
        const redirectTo = location.search.split("redirect=")[1];
        history.push(redirectTo);
      }
      // push user to main page after success login
      setLoading(false);
      history.push("/");
    } catch (error) {
      setLoading(false);
      ToastNotifications.error(t("LOGIN_FAILED"), { position: "top-right" });
    }
  };

  // if user exist redirect him to ./
  useEffect(() => {
    const email = localStorage.getItem("auth-email");
    if (email) {
      history.push("./");
    }
  }, [history]);

  // const handleRedirect = () => {
  //   if (location.search?.split("redirect=")?.length > 1) {
  //     return `?redirect=${decodeURI(location.search.split("redirect=")[1])}`;
  //   }
  //   return "";
  // };

  const handleClickBack = () => setEmailAuth(false);

  const submit = () => {
    if (!isEmailAuth) {
      setEmailAuth(true);
    } else {
      loginUser(email, password);
    }
  };

  return (
    <div className="login">
      <Header
        isSidebarVisible={isSidebarVisible}
        onOpen={() => setSidebarVisible(true)}
        onClose={() => setSidebarVisible(false)}
      />
      <Sidebar isVisible={isSidebarVisible} />
      <div className="login-outter">
        <div className="container">
          <div className="login-inner">
            <div className="login-form__wrap">
              <form
                className="login-form"
                id="novalidatedform"
                onSubmit={handleSubmit(submit)}
                autoComplete="off"
                noValidate
              >
                <div className="login-form__inner">
                  {isEmailAuth ? (
                    <>
                      <div className="login-form__header">
                        <Typography
                          as="h1"
                          fs="26px"
                          color="#313236"
                          lh="40px"
                          fw="700"
                        >
                          {t("LOGIN_FORM_WELCOME_TEXT")}
                        </Typography>
                      </div>
                      <p className="login-form__subheading">{email}</p>
                      <div className="login-form__body">
                        <div className="login-form__group login-form__group--password">
                          <Input
                            className="login-form__input"
                            name="password"
                            type="password"
                            label={t("LOGIN_FORM_EMAIL_LABEL_TEXT")}
                            form="novalidatedform"
                            placeholder="**********"
                            message={errors.password?.message}
                            register={() =>
                              register("password", passwordValidators)
                            }
                          />
                        </div>

                        <div
                          className={`login-form__group login-form__group-agreement ${
                            errors.checked ? "error" : ""
                          }`}
                        >
                          <input
                            className="login-form__checkbox"
                            type="checkbox"
                            id="Sho"
                            {...register("checked")}
                          />
                          <label htmlFor="Sho">
                            <Typography
                              as="p"
                              fs="16px"
                              lh="20px"
                              fw="400"
                              color="#323232"
                            >
                              {t("LOGIN_FORM_CHECKBOX_TEXT")}
                            </Typography>
                          </label>
                        </div>
                        <BaseBtn
                          className="blue-btn login-form__submit"
                          type="submit"
                          loading={isLoading}
                        >
                          {t("LOGIN_FORM_LOGINBTN_TEXT")}
                        </BaseBtn>
                        <BaseBtn
                          className="blue-btn login-form__back"
                          onClick={handleClickBack}
                        >
                          {t("LOGIN_FORM_BACKBTN_TEXT")}
                        </BaseBtn>
                      </div>
                      <div className="login-form__footer">
                        <BaseBtn
                          className="login-form__reset"
                          href="/reset"
                          link
                        >
                          {t("LOGIN_FORM_FORGOT_TEXT")}
                        </BaseBtn>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="login-form__header">
                        <Typography
                          as="h1"
                          fs="26px"
                          color="#313236"
                          lh="40px"
                          fw="700"
                        >
                          {t("SIGN_IN")}
                        </Typography>
                      </div>
                      <div className="login-form__body">
                        <div className="login-form__group">
                          <Input
                            className="login-form__input-email"
                            name="email"
                            type="email"
                            label={t("EMAIL")}
                            form="novalidatedform"
                            placeholder="example@mail.com"
                            message={errors.email?.message}
                            register={() => register("email", emailValidators)}
                          />
                          <BaseBtn
                            className="blue-btn login-form__submit"
                            type="submit"
                          >
                            {t("LOGIN_FORM_SUBMITBTN_TEXT")}
                          </BaseBtn>
                        </div>
                      </div>
                      <div className="login-form__footer">
                        <Typography
                          as="p"
                          fs="16px"
                          color="#313236"
                          lh="20px"
                          fw="400"
                        >
                          {t("LOGIN_FORM_TEXT")}
                        </Typography>
                        <BaseBtn
                          className="login-form__signup"
                          href="/register"
                          link
                        >
                          {t("LOGIN_FORM_SIGNUPBTN_TEXT")}
                        </BaseBtn>
                      </div>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <FooterHoriz />
    </div>
  );
};

export default withRouter(Login);
