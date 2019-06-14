import React from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components/macro";
import { format } from "date-fns";

const Avatar = styled.img.attrs({
  className: "mr-3",
})`
  max-width: 32px;
`;

const code = (props: any) => (
  <pre className="pre-scrollable">
    <code>{props.value}</code>
  </pre>
);

const table = (table: any) => (
  <table className="table table-bordered table-sm">{table.children}</table>
);

export default function Comment(props: AddCommentProps) {
  return (
    <div className="media">
      <Avatar src={props.avatar_url} alt={props.login} />
      <div className="media-body">
        <small className="text-muted">
          {props.login} - {format(props.added, "DD.MM.YYYY HH:mma")}
        </small>
        <ReactMarkdown source={props.text} renderers={{ code, table }} />
      </div>
    </div>
  );
}

type AddCommentProps = {
  avatar_url: string;
  login: string;
  text: string;
  added: string;
};