import React from 'react';  
import { Accordion, AccordionSummary, AccordionDetails, Typography, Grid, Button } from '@mui/material';  
import { parse } from 'json2csv';  
import { AlertObject } from '@/services/types/alert.type';

export default function Json2CSV({
    isMobile,
    data
  }: {
    isMobile: any
    data: AlertObject[];
  }) {  

  const handleExportToCSV = () => {  
    const fields = [  
      { label: 'Alert ID', value: 'alert.id' },  
      { label: 'Headline', value: 'alert.headline' },  
      { label: 'Description', value: 'alert.description' },  
      { label: 'Address', value: 'alert.address' },  
      { label: 'Date & Time', value: 'alert.dateTime' },  
      { label: 'Category', value: 'alert.category' },  
      { label: 'Sub-category', value: 'alert.sub_category' },  
      { label: 'Rating', value: 'alert.rating' },  
      { label: 'Rating Title', value: 'alert.rating_title' },  
      { label: 'Rating Criteria', value: 'alert.rating_criteria' },  
      { label: 'Listeners Count', value: 'scanner.listeners_count' },  
      { label: 'Scanner Title', value: 'scanner.scanner_title' },  
      { label: 'County Name', value: 'scanner.county_name' },  
      { label: 'State Name', value: 'scanner.state_name' },  
    ];  

    try {  
      const csv = parse(data, { fields });  
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });  
      const url = window.URL.createObjectURL(blob);  

      const a = document.createElement('a');  
      a.href = url;  
      a.download = 'alerts.csv';  
      a.click();  
      window.URL.revokeObjectURL(url);  
    } catch (err) {  
      console.error(err);  
    }  
  };  

  return (  
    <div>  
      {isMobile ? (  
        <Grid item xs={12}>  
            <Button  
              variant="contained"  
              color="primary"  
              onClick={handleExportToCSV}  
              style={{ marginLeft: 16 }} // Adjust the margin as needed  
              >  
              Export to CSV  
            </Button>  
        </Grid> 
      ) : (  
        <Grid item xs={12}>  
            <Button  
              variant="contained"  
              color="primary"  
              onClick={handleExportToCSV}  
              style={{ marginLeft: 16, marginTop:16 }} // Adjust the margin as needed  
              >  
              Export to CSV  
            </Button>  
        </Grid>  
      )}  
    </div>  
  );  
}