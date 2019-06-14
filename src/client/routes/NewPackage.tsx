import React, { useState } from "react";
import axios from "axios";
import { get, isEmpty } from "lodash/fp";

import MainCard from "client/components/MainCard";
import { RouteComponentProps } from "@reach/router";
import PackageForm from "client/components/PackageForm";
import { Package } from "client/components/PackageList";

// The error messagse from 'Joi' are not quite a joy to parse. :(
const parseError = (error: string) => {
  const firstBracket = error.indexOf("[");
  const lastBracket = error.lastIndexOf("]");
  const message = error.slice(firstBracket + 1, lastBracket) || "";
  const match = message.match(/"(.*?)"/) || [];
  const id = match[1];

  return { id, message };
};

const makeGeneralError: MakeGeneralError = message => ({ id: "", message });

const handleSubmit: HandleSubmit = setError => async data => {
  try {
    await axios.post("/api/v1/packages", data);
  } catch (e) {
    switch (get("response.status", e)) {
      case 403:
        return setError(makeGeneralError("You are not logged in!"));
      case 400:
        return setError(parseError(e.response.data.message));
      default:
        return setError(makeGeneralError("An unknown error has occurred"));
    }
  }
};

export default function NewPackage(props: NewPackageProps) {
  const [error, setError] = useState({}) as [Error, () => void];
  const onSubmit = handleSubmit(setError);

  return (
    <MainCard header="Add a new Package">
      {!isEmpty(error) && error.id === null && (
        <div className="alert alert-danger" role="alert">
          {error.message}
        </div>
      )}

      <PackageForm
        onSubmit={onSubmit}
        error={error}
        submitButton={
          <button className="btn btn-success" type="submit">
            <i className="fal fa-save mr-2" />
            Add Package
          </button>
        }
      />
    </MainCard>
  );
}

type Error = {
  id: string;
  message: string;
};

type NewPackageProps = RouteComponentProps<{}>;

type HandleSubmit = (
  setError: (error: Error) => void
) => (data: Package) => void;

type MakeGeneralError = (message: string) => Error;

type NewPackageData = {
  tags: Array<string>;
  tagsString: string;
};