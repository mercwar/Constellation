/* FILE: constellation_validator.h */
/* PATH: /Constellation/constellation_validator.h */

/* ------------------------------------------------------------
   AVIS.HEADER
   ROLE: CONSTELLATION_VALIDATOR_HEADER
   PURPOSE: Header for the Constellation Validator. Defines the
            prototypes, constants, and structures used to verify
            the integrity, schema compliance, and correctness of
            the unified intelligence model produced by the
            Constellation Linker.
   AUTHOR: Demon
   NOTES: This is the FIFTH HEADER in the Constellation chain.
          It enforces the final law before AVIS ingestion.
   ------------------------------------------------------------ */

#ifndef CONSTELLATION_VALIDATOR_H
#define CONSTELLATION_VALIDATOR_H

#define MAX_PATH 1024
#define MAX_ERRORS 256

/* ------------------------------------------------------------
   STRUCT: ValidationError
   PURPOSE: Represents a single validation failure
   ------------------------------------------------------------ */
typedef struct {
    char message[MAX_PATH];
} ValidationError;

/* ------------------------------------------------------------
   FUNCTION PROTOTYPES
   ------------------------------------------------------------ */

/* Checks if the intelligence.model file exists and is readable */
int validate_model_exists(const char *path);

/* Validates the binary structure of the intelligence model */
int validate_model_structure(const char *path,
                             ValidationError errors[],
                             int *errorCount);

/* Validates schema compliance (AVIS law) */
int validate_schema(const char *path,
                    ValidationError errors[],
                    int *errorCount);

/* Validates version continuity (no missing or broken links) */
int validate_version_chain(const char *repoPath,
                           ValidationError errors[],
                           int *errorCount);

/* Runs all validation steps and returns PASS/FAIL */
int run_full_validation(const char *repoPath);

#endif /* CONSTELLATION_VALIDATOR_H */
