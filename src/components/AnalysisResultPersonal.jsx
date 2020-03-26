import React from "react";
import PropTypes from "prop-types";

import { withRouter } from "react-router-dom";
import { graphql, withApollo } from "react-apollo";
import * as compose from "lodash.flowright";

import {
  buildPersonalAnalysisByNameQuery,
  buildPersonalAnalysisByIdQuery,
  userSettingsQuery
} from "../graphql/Queries";

import LoadingIndicator from "./LoadingIndicator";
import AnalysisResultPersonalRender from "./AnalysisResultPersonalRender";
import { deleteUserAuthData } from "../utils/AuthUtils";
/**
 * result screen for personal analysis
 */
const AnalysisResultPersonal = props => {
  // extracting relevant parameters from props
  const { personalAnalysesById, personalAnalysesByNames } = props;
  let { currentUser } = props;
  let personalAnalysisResults = [];
  try {
    // if gql state loading => showing spinner
    if (
      (personalAnalysesById && personalAnalysesById.loading) ||
      (personalAnalysesByNames && personalAnalysesByNames.loading) ||
      (currentUser && currentUser.loading)
    ) {
      return <LoadingIndicator text="Berechne Resultate für Namen..." />;
    }

    // if gql state error => displaying error in loader to make it more visible for debugging
    const error =
      (personalAnalysesById && personalAnalysesById.error) ||
      (personalAnalysesByNames && personalAnalysesByNames.error);
    if (error) {
      console.error(error);
      return (
        <LoadingIndicator
          text={"A critical error occurred when fetching data..."}
        />
      );
    }

    // if current user query throws error => this means user is not authenticated
    if (currentUser && currentUser.error) {
      console.log("user not authenticated");
      currentUser = null;
    }

    // this component fetches results in two cases
    // a) An id of a stored analysis is provided => fetching result based on input parameters of stored id
    // b) Input parameters (names + dob) are provided => fetching results based on input parameters passed
    // both queries are configured for this component and are skipped if the params are not passed

    if (props.match.params.analysisId && personalAnalysesById) {
      personalAnalysisResults =
        personalAnalysesById.analysis.personalAnalysisResults;
    } else {
      personalAnalysisResults = personalAnalysesByNames.personalAnalysisResults;
    }
  } catch (error) {
    console.log("error AnalysisResultPersonal:", error.message);
    deleteUserAuthData();
    props.history.push("/login");
  }

  // returning render component with result param set (vs. analysis)
  return (
    <AnalysisResultPersonalRender
      personalAnalysisResult={personalAnalysisResults[0]}
      personalAnalysisCompareResult={personalAnalysisResults[1]}
      user={props.currentUser.currentUser}
    />
  );
};

// prop types validation
AnalysisResultPersonal.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      firstNames: PropTypes.string,
      lastNames: PropTypes.string,
      dateOfBirth: PropTypes.string,
      analysisId: PropTypes.string
    }).isRequired
  }).isRequired
};

// constructing query with input parameters taken from URL params
export default compose(
  graphql(userSettingsQuery, {
    name: "currentUser"
  }),
  graphql(buildPersonalAnalysisByIdQuery(false), {
    options: params => ({
      // query by id (skipped if no id present)
      // returning input variables
      // initializing with fetch policy that will not use cache
      // this is needed as this query returns different results based on the user status (logged in vs. guest)
      // and the purchased and used credits for an analysis this query refers to (no credit, short/long) credit
      // Therefore caching can be likely wrong.
      variables: {
        id: parseInt(params.match.params.analysisId, 10),
        isPdf: false,
        longTexts: false
      },
      update: "network-only"
    }),
    // skipping this query if no id is provided
    skip: params => !params.match.params.analysisId,
    name: "personalAnalysesById"
  }),
  graphql(buildPersonalAnalysisByNameQuery(false), {
    options: params => {
      // decoding url param values
      const firstNames = decodeURIComponent(params.match.params.firstNames);
      const lastNames = decodeURIComponent(params.match.params.lastNames);
      const dateOfBirth = decodeURIComponent(params.match.params.dateOfBirth);

      // configuring options object to return
      // initializing with fetch policy that will not use cache
      // this is needed as this query returns different results based on the user status (logged in vs. guest)
      // and the purchased and used credits for an analysis this query refers to (no credit, short/long) credit
      // Therefore caching can be likely wrong.
      const options = {
        fetchPolicy: "network-only"
      };

      // if more than one first name => splitting and getting results for both names
      if (firstNames.split(",").length > 1) {
        options.variables = {
          inputs: [
            {
              firstNames: firstNames.split(",")[0],
              lastName: lastNames.split(",")[0],
              dateOfBirth
            },
            {
              firstNames: firstNames.split(",")[1],
              lastName: lastNames.split(",")[1],
              dateOfBirth
            }
          ]
        };
      } else {
        options.variables = {
          inputs: [
            {
              firstNames,
              lastName: lastNames,
              dateOfBirth
            }
          ]
        };
      }

      return options;
    },
    // skipping this query if no names are provided
    skip: params => !params.match.params.firstNames,
    name: "personalAnalysesByNames"
  })
)(withApollo(withRouter(AnalysisResultPersonal)));
