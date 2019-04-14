/* eslint-disable indent */
import React from "react";
import { Link, withRouter } from "react-router-dom";
import { arrayOf, object, string, bool } from "prop-types";

const capitalize = value =>
  value
    .split(" ")
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(" ");

const formatDate = dateTime => {
  const date = new Date(dateTime);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  return `${date.getDate()}-${months[date.getMonth()]}-${date.getFullYear()}`;
};

export const Table = ({ data, history, allowEdit }) => {
  const goToRecordDetail = id => history.push(`/record/${id}`);
  return (
    <table className="dashboard-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Type</th>
          <th>Date Reported</th>
          <th>Status</th>
          <th> </th>
        </tr>
      </thead>

      <tbody id="table-body">
        {data.map(item => (
          <tr
            key={item.id}
            className="dashboard-table-row"
            onClick={() => goToRecordDetail(item.id)}
          >
            <td> {item.comment} </td>
            <td> {capitalize(item.type)} </td>
            <td> {formatDate(item.created_on)} </td>
            <td> {capitalize(item.status)} </td>
            <td
              onClick={e => e.stopPropagation()}
              role="presentation"
              className="edit-link-column"
            >
              {item.status === "pending review" && allowEdit && (
                <Link
                  className="dashboard-table-link edit-link"
                  to={`/edit-record/${item.id}`}
                >
                  <svg
                    id="edit-svg"
                    width="16px"
                    height="19px"
                    viewBox="0 0 16 19"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g
                      id="Page-1"
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g
                        id="My-Records-Page"
                        transform="translate(-910.000000, -267.000000)"
                      >
                        <g
                          id="Group-2"
                          transform="translate(910.000000, 268.000000)"
                        >
                          <path
                            d="M10.5,5.5 L4.5,13.5"
                            id="Line-3"
                            stroke="#D81E5B"
                            strokeWidth="3"
                            strokeLinecap="square"
                          />
                          <path
                            d="M13.5,1.5 L13.38,1.66"
                            id="Line-3-Copy"
                            stroke="#D81E5B"
                            strokeWidth="3"
                            strokeLinecap="square"
                          />
                          <polygon
                            id="Path-2"
                            fill="#D81E5B"
                            transform="translate(2.093396, 16.576831) rotate(-3.000000) translate(-2.093396, -16.576831) "
                            points="1.4658568 15.1987855 3.47406171 16.8554235 0.71272957 17.9548763"
                          />
                        </g>
                      </g>
                    </g>
                  </svg>
                </Link>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

Table.propTypes = {
  data: arrayOf(object).isRequired,
  history: arrayOf(string).isRequired,
  allowEdit: bool.isRequired
};

export default withRouter(Table);
