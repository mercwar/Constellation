/* FILE: constellation_reduce.c */
/* PATH: /Constellation/constellation_reduce.c */

/* ------------------------------------------------------------
   AVIS.HEADER
   ROLE: CONSTELLATION_REDUCER
   PURPOSE: Reduces repo Constellation folders by removing bulk,
            keeping only essential version files, and preparing
            the repo for future compilation and auto-upgrades.
   AUTHOR: Demon
   NOTES: This is the SECOND CONSTELLATION PROGRAM. It works
          together with constellation.c to maintain lightweight,
          future-ready repos.
   ------------------------------------------------------------ */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <dirent.h>

#define MAX_PATH 1024
#define MAX_KEEP 32

/* ------------------------------------------------------------
   FUNCTION: is_keep_file
   PURPOSE: Determines if a file should be kept during reduction.
            We keep:
            - constellation.c
            - constellation.h
            - version folders
            - .version files
   ------------------------------------------------------------ */
int is_keep_file(const char *name) {
    if (strcmp(name, "constellation.c") == 0) return 1;
    if (strcmp(name, "constellation.h") == 0) return 1;
    if (strstr(name, ".version") != NULL) return 1;
    return 0;
}

/* ------------------------------------------------------------
   FUNCTION: is_version_folder
   PURPOSE: Detects version folder naming patterns
   ------------------------------------------------------------ */
int is_version_folder(const char *name) {
    if (strncmp(name, "v", 1) == 0) return 1;
    if (strncmp(name, "version", 7) == 0) return 1;
    if (strchr(name, '.') != NULL) return 1;
    return 0;
}

/* ------------------------------------------------------------
   FUNCTION: reduce_constellation_folder
   PURPOSE: Removes unnecessary files from a Constellation folder
            while preserving version structure and core programs.
   ------------------------------------------------------------ */
void reduce_constellation_folder(const char *path) {
    DIR *dir = opendir(path);
    if (!dir) {
        printf("No Constellation folder found: %s\n", path);
        return;
    }

    struct dirent *entry;
    char fullPath[MAX_PATH];

    printf("Reducing Constellation folder: %s\n", path);

    while ((entry = readdir(dir)) != NULL) {

        /* Skip . and .. */
        if (strcmp(entry->d_name, ".") == 0 ||
            strcmp(entry->d_name, "..") == 0)
            continue;

        snprintf(fullPath, sizeof(fullPath), "%s/%s", path, entry->d_name);

        /* Keep version folders */
        if (entry->d_type == DT_DIR && is_version_folder(entry->d_name)) {
            printf("KEEP FOLDER: %s\n", fullPath);
            continue;
        }

        /* Keep essential files */
        if (entry->d_type == DT_REG && is_keep_file(entry->d_name)) {
            printf("KEEP FILE: %s\n", fullPath);
            continue;
        }

        /* Delete everything else */
        printf("DELETE: %s\n", fullPath);
        remove(fullPath);
    }

    closedir(dir);
}

/* ------------------------------------------------------------
   MAIN PROGRAM
   PURPOSE: Entry point for the Constellation reducer
   ------------------------------------------------------------ */
int main(int argc, char *argv[]) {

    if (argc < 2) {
        printf("Usage: constellation_reduce <repo-path>\n");
        return 1;
    }

    char constellationPath[MAX_PATH];
    snprintf(constellationPath, sizeof(constellationPath),
             "%s/Constellation", argv[1]);

    reduce_constellation_folder(constellationPath);

    printf("Constellation reduction complete.\n");
    return 0;
}
