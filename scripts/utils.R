# utils.R - Utility Functions

#' Escape HTML special characters
#' @param text character string
#' @return escaped character string
escape_html <- function(text) {
  if (is.na(text) || is.null(text)) return("")

  text <- gsub("&", "&amp;", text)
  text <- gsub("<", "&lt;", text)
  text <- gsub(">", "&gt;", text)
  text <- gsub('"', "&quot;", text)
  text <- gsub("'", "&#39;", text)

  return(text)
}

#' Truncate text to specified length
#' @param text character string
#' @param max_length integer
#' @return truncated string
truncate_text <- function(text, max_length = 200) {
  if (is.na(text) || nchar(text) <= max_length) {
    return(text)
  }

  substr(text, 1, max_length - 3) %>%
    paste0("...")
}

#' Check if required R packages are installed
#' @param packages character vector of package names
#' @return logical, TRUE if all installed
check_packages <- function(packages) {
  missing <- packages[!(packages %in% installed.packages()[,"Package"])]

  if (length(missing) > 0) {
    message("Missing required packages:")
    message(paste("  -", missing, collapse = "\n"))
    message("\nInstall with:")
    message(sprintf('install.packages(c("%s"))', paste(missing, collapse = '", "')))
    return(FALSE)
  }

  return(TRUE)
}
