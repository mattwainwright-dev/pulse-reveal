import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

export function useTable(tableName) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function fetchData() {
      setLoading(true);

      const { data, error } = await supabase
        .from(tableName)
        .select("*");

      if (!active) return;

      if (error) {
        setError(error.message);
      } else {
        setData(data);
        setError(null);
      }

      setLoading(false);
    }

    fetchData();

    return () => {
      active = false;
    };
  }, [tableName]);

  async function addRow(row) {
    const { data: saved, error } = await supabase
      .from(tableName)
      .insert(row)
      .select()
      .single();

    if (error) throw error;

    setData((current) => [...current, saved]);
    return saved;
  }

  return { data, loading, error, addRow };
}