import { ParsedUrlQuery } from 'querystring';

export type SearchParams = {
  [key: string]: string | string[] | number | number[] | null,
};

/**
 * This function prepares a correct search string
 * from a given currentParams and paramsToUpdate.
 */
export function getSearchWith(
  currentParams: ParsedUrlQuery,
  paramsToUpdate: SearchParams,
  pathname?: string, // it's our custom type
): string {
  // copy currentParams by creating new object from a string
  function objectToQueryString(paramsObj: ParsedUrlQuery): string {
    const queryParams = new URLSearchParams();

    Object.keys(paramsObj).forEach((key) => {
      const values = paramsObj[key];
      if (Array.isArray(values)) {
        values.forEach((value) => {
          queryParams.append(key, value);
        });
      } else {
        queryParams.append(key, values!);
      }
    });

    return queryParams.toString();
  }

  const newParams = new URLSearchParams(
    objectToQueryString(currentParams),
  );

  // Here is the example of paramsToUpdate
  // {
  //   sex: 'm',                ['sex', 'm']
  //   order: null,             ['order', null]
  //   centuries: ['16', '19'], ['centuries', ['16', '19']]
  // }
  //
  // - params with the `null` value are deleted;
  // - string value is set to given param key;
  // - array of strings adds several params with the same key;

  Object.entries(paramsToUpdate)
    .forEach(([ key, value ]) => {
      if (value === null) {
        newParams.delete(key);
      } else if (Array.isArray(value)) {
        // we delete the key to remove old values
        newParams.delete(key);

        if (value.length === 0) {
          return;
        }

        // newParams.append(key, value.join(','));

        value.forEach((part) => {
          newParams.append(key, `${ part }`);
        });
      } else {
        newParams.set(key, `${ value }`);
      }
    });

  const returnParams = newParams.toString();

  // we return a string to use it inside links
  if (pathname) {
    return !returnParams ? `${ pathname }` : `${ pathname }?${ returnParams }`;
  }

  return returnParams;
}
