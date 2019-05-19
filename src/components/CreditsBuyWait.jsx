import React, { useState, useEffect, useRef } from 'react';
import { Query } from 'react-apollo';
import { currentWindowToken } from '../graphql/Queries';
import LoadingIndicator from './LoadingIndicator';

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const Wait = ({ onSuccess, data, loading, refetch }) => {
  let [count, setCount] = useState(1);

  if (data && data.windowToken && data.windowToken.wpOrderId) {
    onSuccess();
  }

  useInterval(() => {
    refetch();
    setCount(count + 1);
  }, 1000 * 10);

  return (
    <LoadingIndicator text={`Waiting for purchase to come through. ${count}`} />
  );
};

export default ({ windowToken, onSuccess }) => {
  return (
    <Query query={currentWindowToken} variables={{ windowToken }}>
      {({ data, loading, refetch }) => (
         <Wait {...{ onSuccess, data, loading, refetch }} />
      )}
    </Query>
  );
}
