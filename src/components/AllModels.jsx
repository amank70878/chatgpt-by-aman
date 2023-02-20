import React, { useEffect, useState } from "react";
import { fetchModels } from "../utils/callApi";

export const AllModels = ({ currentModel, setCurrentModel }) => {
  const [models, setModels] = useState(null);

  useEffect(() => {
    fetchModels(setModels);
  }, []);

  return (
    <div>
      {models && (
        <select
          value={currentModel}
          onChange={(e) => setCurrentModel(e.target.value)}
          className="w-full bg-gray-600 py-2 px-2 rounded-md my-5"
        >
          {models.map(({ id }) => {
            return (
              <option key={id} value={id}>
                {id}
              </option>
            );
          })}
        </select>
      )}
    </div>
  );
};
