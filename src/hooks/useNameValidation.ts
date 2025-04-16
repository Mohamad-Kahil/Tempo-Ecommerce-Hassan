import { useState } from "react";
import { supabase } from "@/lib/supabase";

export function useNameValidation() {
  const [isValidating, setIsValidating] = useState(false);

  const checkNameUniqueness = async (
    name: string,
    nameAr: string | null | undefined,
    tableName: string,
    currentId?: string,
  ): Promise<{
    isUnique: boolean;
    field: string | null;
    message: string | null;
  }> => {
    try {
      setIsValidating(true);

      // Check English name uniqueness
      if (name && name.trim() !== "") {
        const { data: englishNameData, error: englishNameError } =
          await supabase
            .from(tableName)
            .select("id")
            .ilike("name", name.trim())
            .limit(1);

        if (englishNameError) throw englishNameError;

        // If we found a record with this name and it's not the current record being edited
        if (englishNameData && englishNameData.length > 0) {
          if (!currentId || englishNameData[0].id !== currentId) {
            return {
              isUnique: false,
              field: "name",
              message: `This name is already in use in ${tableName}. Please choose a different name.`,
            };
          }
        }
      }

      // Check Arabic name uniqueness if provided
      if (nameAr && nameAr.trim() !== "") {
        try {
          // First check if the name_ar column exists in the table
          const { data: columnData, error: columnError } = await supabase.rpc(
            "check_column_exists",
            {
              table_name: tableName,
              column_name: "name_ar",
            },
          );

          if (columnError) {
            console.warn(
              `Could not check if name_ar column exists in ${tableName}:`,
              columnError,
            );
            // Continue without checking Arabic name uniqueness
          } else if (columnData) {
            // Column exists, proceed with uniqueness check
            const { data: arabicNameData, error: arabicNameError } =
              await supabase
                .from(tableName)
                .select("id")
                .ilike("name_ar", nameAr.trim())
                .limit(1);

            if (arabicNameError) throw arabicNameError;

            // If we found a record with this Arabic name and it's not the current record being edited
            if (arabicNameData && arabicNameData.length > 0) {
              if (!currentId || arabicNameData[0].id !== currentId) {
                return {
                  isUnique: false,
                  field: "name_ar",
                  message: `This Arabic name is already in use in ${tableName}. Please choose a different name.`,
                };
              }
            }
          }
        } catch (err) {
          console.warn(
            `Error checking Arabic name uniqueness in ${tableName}:`,
            err,
          );
          // Continue without failing the whole validation
        }
      }

      // If we get here, both names are unique
      return { isUnique: true, field: null, message: null };
    } catch (error) {
      console.error(`Error checking name uniqueness in ${tableName}:`, error);
      return {
        isUnique: false,
        field: null,
        message: `Error validating name uniqueness: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    } finally {
      setIsValidating(false);
    }
  };

  return {
    isValidating,
    checkNameUniqueness,
  };
}
