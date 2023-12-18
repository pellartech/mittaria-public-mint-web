/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useRef, useState } from "react";
import buttonSubmit from "../../../assets/images/creator-form/button.svg";
import { Formik, Form, Field, ErrorMessage, FormikProps } from "formik";
import * as Yup from "yup";
import { useAccount, useContractRead } from "wagmi";
import { APP_ENVIRONMENTS } from "@/config";
import { toast } from "react-toastify";
import ToastMessage from "@/ui/components/common/ToastMessage";
import { GENESIS_MINT_ABI } from "@/lib/abi/genesisMint";
import { zeroAddress } from "viem";

export interface ICreatorForm {
  name: string;
  phone_number: string | number;
  email: string;
  address: string;
  commercial_intentions: string;
  support_from_mittaria: string;
}

const initFormValue: ICreatorForm = {
  name: "",
  phone_number: "",
  email: "",
  address: "",
  commercial_intentions: "",
  support_from_mittaria: "",
};

const { API_ROOT_URL } = APP_ENVIRONMENTS;

export const CreatorFormSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address format")
    .required("Email is required"),
  name: Yup.string().required("Name is required"),
  phone_number: Yup.string().required("Phone number is required"),
  address: Yup.string().required("Address is required"),
  commercial_intentions: Yup.string().required(
    "Commercial Intentions is required"
  ),
});

const CreatorForm = () => {
  const { address, isConnected, connector: activeConnector } = useAccount();
  const [enoughCondition, setEnoughCondition] = useState(true);
  const [checked, setChecked] = useState(false);
  const formRef = useRef<FormikProps<ICreatorForm>>(null);
  const [err, setErr] = useState("");

  const configContract = {
    address: APP_ENVIRONMENTS.GENESIS_MINT_CONTRACT_ADDRESS as any,
    abi: GENESIS_MINT_ABI,
  };

  const { data: balance } = useContractRead({
    ...configContract,
    functionName: "balanceOf",
    args: [address || zeroAddress],
    watch: true,
  });

  useEffect(() => {
    if (Number(balance)) {
      setEnoughCondition(true);
    } else {
      setEnoughCondition(false);
    }
  }, [balance]);

  return (
    <div className="creator-form w-full text-white">
      <div className="terms-conditions">
        <Formik
          initialValues={initFormValue}
          validationSchema={CreatorFormSchema}
          innerRef={formRef}
          onSubmit={async (payload, { setSubmitting, resetForm }) => {
            setErr("");
            const url = `${API_ROOT_URL}/creators`;
            try {
              const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify({ ...payload, wallet_address: address }),
                headers: {
                  "Content-type": "application/json; charset=UTF-8",
                },
              });
              const data = await response.json();
              if (data?.success) {
                resetForm();
                setChecked(false);
                toast(
                  <ToastMessage
                    title="Submit success"
                    status="success"
                    className="text-white"
                  >
                    Your form has been submitted successfully!
                  </ToastMessage>
                );
              } else {
                toast(
                  <ToastMessage
                    title="Error"
                    status="error"
                    className="text-white"
                  >
                    Error
                  </ToastMessage>
                );
              }
            } catch (error: any) {
              console.log("error: ", error);
              setErr("Error");
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="form-creator">
              <div className="form">
                <div className="input-item">
                  <span className="required">*</span>
                  <Field
                    name="name"
                    type="text"
                    placeholder="Name"
                    className="field-input"
                  />
                  <ErrorMessage
                    name="name"
                    className="error-message"
                    component="div"
                  />
                </div>

                <div className="input-item">
                  <span className="required">*</span>
                  <Field
                    name="phone_number"
                    type="text"
                    placeholder="Phone Number"
                    className="field-input"
                  />
                  <ErrorMessage
                    name="phone_number"
                    className="error-message"
                    component="div"
                  />
                </div>

                <div className="input-item">
                  <span className="required">*</span>
                  <Field
                    name="email"
                    type="email"
                    placeholder="E-mail"
                    className="field-input"
                  />
                  <ErrorMessage
                    name="email"
                    className="error-message"
                    component="div"
                  />
                </div>

                <div className="input-item textarea-item">
                  <span className="required">*</span>
                  <Field
                    component="textarea"
                    rows="3"
                    name="address"
                    type="text"
                    placeholder="Address"
                    className="field-input"
                  />
                  <ErrorMessage
                    name="address"
                    className="error-message"
                    component="div"
                  />
                </div>

                <div className="input-item">
                  <span className="required">*</span>
                  <Field
                    name="commercial_intentions"
                    type="text"
                    placeholder="Commercial Intentions"
                    className="field-input"
                  />
                  <ErrorMessage
                    name="commercial_intentions"
                    className="error-message"
                    component="div"
                  />
                </div>

                <div className="input-item">
                  <Field
                    name="support_from_mittaria"
                    type="text"
                    placeholder="Support from Mittaria"
                    className="field-input"
                  />
                  <ErrorMessage
                    name="support_from_mittaria"
                    className="error-message"
                    component="div"
                  />
                </div>

                <div className="title">Terms & Conditions</div>
                <div className="content font-altform">
                  We are Mittaria Origin Limited, a company registered in
                  British Virgin Islands, whose registered number is 2100690,
                  and registered address is 1st Floor, Irvine’s Place, 159 Main
                  Street, P.O. Box 2132, Road Town, Tortola, British Virgin
                  Islands (we/us/our).
                  <br />
                  <br />
                  1.2. By using our Website, you confirm that you accept these
                  Terms of Use and that you agree to comply with them. If you do
                  not agree to these Terms of Use, you must not access or use
                  our Website.
                  <br />
                  <br />
                  1.3. We may amend these Terms of Use from time to time. Every
                  time you wish to use our Website, please check these Terms of
                  Use to ensure you understand the terms that apply at that
                  time.
                </div>
                <div className="checkbox">
                  <label>
                    <span className="accept">
                      &nbsp;&nbsp;&nbsp;I accept Terms & Conditions
                    </span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        setChecked(!checked);
                      }}
                    />
                    <span className="checkmark"></span>
                  </label>
                </div>
                <div className="text-m mb-2 text-white text-center warning font-altform">
                  {address && activeConnector && isConnected ? (
                    <>{!enoughCondition && "You don't own tokens yet, so you can't submit the form"}</>
                  ) : (
                    "Connect wallet to verify asset"
                  )}
                </div>
                {err && <div className="err-server">{err}</div>}
                <div className="mx-auto mt-8 flex justify-center">
                  <button
                    className="btn-submit"
                    type="submit"
                    disabled={
                      isSubmitting || !checked || !address || !enoughCondition
                    }
                  >
                    <img src={buttonSubmit.src} />
                    <span className="text">
                      {!isSubmitting ? "SUBMIT" : "SUBMITTING..."}
                    </span>
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreatorForm;
