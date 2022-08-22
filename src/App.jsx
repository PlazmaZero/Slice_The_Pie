
import React, { useRef, useEffect, useState } from 'react';
import MyD3Component from "./MyD3Component.jsx";
import './App.css';

import PieChartFunctional from "./PieChartFunctional.jsx";
import PieChartClass from "./PieChartClass.jsx";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon'
import Tooltip from '@material-ui/core/Tooltip';
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

/* Tooltip - to make the information icons and the hover over */
const inputProps = {

  step: 300,
  className: "inputPropClass",
  style: { textAlign: 'center' }

};

const CustomTooltip = withStyles((theme) => ({
  arrow: {
    color: "#71A8FF",
  },
  tooltip: {
    backgroundColor: "#71A8FF",
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
    borderRadius: "0 !important"
  },
}))(Tooltip); 

function TooltipWrapper(props) {

  const [open, setOpen] = React.useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  return(
    <ClickAwayListener onClickAway={handleTooltipClose}>
              <CustomTooltip
                onClose={handleTooltipClose}
                open={open}
                title={props.title}
                arrow
              >
                <button className="iconButton" onClick={handleTooltipOpen}>
                <SvgIcon style={{ fontSize: 15 }}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1-8h-2V7h2v2z"   fill= "white"/>
          </SvgIcon>
          </button>
              </CustomTooltip>
          </ClickAwayListener>
          );

}

/* Input creator */
function BasicTextFields(props) {
  function print() {
    console.log("the real value", props.percent);
  }

  let enterValue = props.value;
  if (props.value == "0%") {
    enterValue = "";
  }

  React.useEffect(print);
  return (
    <TextField
      placeholder="0%"
      inputProps={inputProps}
      value={enterValue}
      onChange={(e) => { console.log(e.target.value);
      console.log("props.value " , props.value);

      let lastItemNoPercent = Number(props.value.replaceAll('%', ''));
      let currentItemNoPercent = e.target.value.replaceAll('%', '');

      if(props.value.includes("%") && !e.target.value.includes("%") && props.value.length-e.target.value.length == 1 && props.value != '0%') {
        currentItemNoPercent = currentItemNoPercent.substring(0, currentItemNoPercent.length - 1);
      }

      currentItemNoPercent = Number(currentItemNoPercent);

    
      let inputPercent = Number(currentItemNoPercent);
      console.log("HERE", inputPercent, props.percent, lastItemNoPercent);
      
      if (isNaN(inputPercent)) {
        inputPercent = lastItemNoPercent;
      }
      let totalPercent = props.percent;
      if (totalPercent + inputPercent - lastItemNoPercent > 100) {
        inputPercent = 100 - totalPercent + lastItemNoPercent;
        totalPercent = 100;
      } 
      else{
        totalPercent = totalPercent + inputPercent - lastItemNoPercent;
      }

      props.function(props.index, inputPercent, totalPercent);
      }}
      style={{ width: "70px", minWidth: "70px", textAlign: 'center' }}
    />
  );
}

/* lines of circle, text, information hover, and input field */
function InputRow(props) {
  let category = props.name;
  let color = props.color;
  let info = props.info;

  return (
    <div className="InputRow">
      <div className="leftItems">
        <Circle color={color} />
        <p className="Inputtext"> {category} <TooltipWrapper title={info}>
        </TooltipWrapper></p>
      </div>
      <BasicTextFields className="textField" function={props.function} index={props.index} value= {props.value} percent = {props.percent} />
    </div>
  );
}

function TotalRow(props) {
  let defaultValue = '';
  if (props.percent >= 100) {
    defaultValue = "100%";
    return(
      <div className= "totalsText">
        <p className = "labelTotal">Total %</p>
        <TextField
        disabled
        value = "100%"
        style={{ width: "70px" }} />
    </div>
    );
  } 
  let value = props.percent.toString() + '%';
  
  return(
    <div className= "totalsText">
    <p className = "labelTotal">Total %</p>
    <TextField
      disabled
      placeholder= {value}
      inputProps={inputProps}
      value = ""
      style={{ width: "70px" }} />
    </div>
    );
  
}

/* Revenues Guess Page */
function PageOne(props) {
  let revenue = props.revenue;
  let changeRevenue = props.changeRevenue;
  let revenueInfo = props.revenueInfo
  let revenuePercent = props.revenuePercent;
  return (<div className="pages">

      <div className = "progressBarWords">
        <p className = "coloredBlue">REVENUES</p>
        <p className = "coloredWhite">EXPENSES</p>
        <p className = "coloredWhite">COMPARE</p>
      </div>
      <ProgressBar1/>


    <h3 className = "earlyPageHeading">UC Davis Revenues</h3>
    <div className = "centerPie">
    <PieChartFunctional className="pieCenter" name="pie1" data={revenue} />
    </div>
    <div className = "titleHeading"><div className = "word" ><p>Function</p></div><div><p>Percentage (%)</p></div></div>
    <InputRow name={revenue[0].name} color={revenue[0].color} info={revenueInfo[0]} index={0} function={changeRevenue} value = {revenue[0].percent} percent = {revenuePercent} />
    <InputRow name={revenue[1].name} color={revenue[1].color} info={revenueInfo[1]} index={1} function={changeRevenue} value = {revenue[1].percent} percent = {revenuePercent} />
    <InputRow name={revenue[2].name} color={revenue[2].color} info={revenueInfo[2]} index={2} function={changeRevenue} value = {revenue[2].percent} percent = {revenuePercent} />
    <InputRow name={revenue[3].name} color={revenue[3].color} info={revenueInfo[3]} index={3} function={changeRevenue} value = {revenue[3].percent} percent = {revenuePercent} />
    <InputRow name={revenue[4].name} color={revenue[4].color} info={revenueInfo[4]} index={4} function={changeRevenue} value = {revenue[4].percent} percent = {revenuePercent} />
    <InputRow name={revenue[5].name} color={revenue[5].color} info={revenueInfo[5]} index={5} function={changeRevenue} value = {revenue[5].percent} percent = {revenuePercent} />
    <InputRow name={revenue[6].name} color={revenue[6].color} info={revenueInfo[6]} index={6} function={changeRevenue} value = {revenue[6].percent} percent = {revenuePercent} />
    <InputRow name={revenue[7].name} color={revenue[7].color} info={revenueInfo[7]} index={7} function={changeRevenue} value = {revenue[7].percent} percent = {revenuePercent} />
    <TotalRow percent = {revenuePercent}/>
    <div className="buttonDiv">
      <button type="button" className="pageButton" className="nextButton" onClick={props.pageUp}> Next </button>
    </div>

  </div>)
}

/* Expenses guess page */
function PageTwo(props) {
  let expenditures = props.expenditures;
  let changeExpenditures = props.changeExpenditures;
  let expenditureInfo = props.expenditureInfo
  let expenditurePercent = props.expenditurePercent;
  return (<div className="pages">
    <div className = "progressBarWords">
        <p className = "coloredBlue">REVENUES</p>
        <p className = "coloredBlue">EXPENSES</p>
        <p className = "coloredWhite">COMPARE</p>
      </div>
      <ProgressBar2/>

    <h3 className = "earlyPageHeading">UC Davis Expenditures</h3>
    <div className = "centerPie">
    <PieChartFunctional className="pieCenter" name="pie2" data={expenditures} />
    </div>
    <div className = "titleHeading"><div className = "word" ><p>Function</p></div><div><p>Percentage (%)</p></div></div>
    <InputRow name={expenditures[0].name} color={expenditures[0].color} info={expenditureInfo[0]} index={0} function={changeExpenditures} value = {expenditures[0].percent} percent = {expenditurePercent} />
    <InputRow name={expenditures[1].name} color={expenditures[1].color} info={expenditureInfo[1]} index={1} function={changeExpenditures} value = {expenditures[1].percent} percent = {expenditurePercent} />
    <InputRow name={expenditures[2].name} color={expenditures[2].color} info={expenditureInfo[2]} index={2} function={changeExpenditures} value = {expenditures[2].percent} percent = {expenditurePercent} />
    <InputRow name={expenditures[3].name} color={expenditures[3].color} info={expenditureInfo[3]} index={3} function={changeExpenditures} value = {expenditures[3].percent} percent = {expenditurePercent} />
    <InputRow name={expenditures[4].name} color={expenditures[4].color} info={expenditureInfo[4]} index={4} function={changeExpenditures} value = {expenditures[4].percent} percent = {expenditurePercent} />
    <InputRow name={expenditures[5].name} color={expenditures[5].color} info={expenditureInfo[5]} index={5} function={changeExpenditures} value = {expenditures[5].percent} percent = {expenditurePercent} />
    <InputRow name={expenditures[6].name} color={expenditures[6].color} info={expenditureInfo[6]} index={6} function={changeExpenditures} value = {expenditures[6].percent} percent = {expenditurePercent} />
    <InputRow name={expenditures[7].name} color={expenditures[7].color} info={expenditureInfo[7]} index={7} function={changeExpenditures} value = {expenditures[7].percent} percent = {expenditurePercent} />
    <InputRow name={expenditures[8].name} color={expenditures[8].color} info={expenditureInfo[8]} index={8} function={changeExpenditures} value = {expenditures[8].percent} percent = {expenditurePercent} />
    <TotalRow percent = {expenditurePercent}/>
    <div className="buttonDiv">
      <button type="button" className="pageButton" className="compareButton" onClick={props.pageUp}> Compare </button>
      <div className = "previousSeparator">
        <button type="button" className="pageButton" className="previousButton" onClick={props.pageBack}> Previous </button>
      </div>
    </div>
  </div>)
}

/* Compare revenues page */
function PageThree(props) {
  return (
    <div>
      <div className = "progressBarWords">
        <p className = "coloredBlue">REVENUES</p>
        <p className = "coloredBlue">EXPENSES</p>
        <p className = "coloredBlue">COMPARE</p>
      </div>
      <ProgressBar3/>
      <h4>RESULTS</h4>
      <h3 className = "latePageHeader">Your Revenue Guess</h3>
      <div className = "centerPie">
      <PieChartFunctional className="pieCenter" name="pie3" data={props.revenue} />
      </div>
      <h3 className = "latePageHeader">Actual Revenue</h3>
      <div className = "centerPie">
      <PieChartFunctional className="pieCenter" name="pie4" data={props.actualRevenue} />
      </div>
      <div className="buttonDiv">
        <button type="button" className="pageButton" className="compareButton" onClick={props.pageUp}> Compare </button>
      </div>
    </div>
  );
}

/* Compare expenses page */
function PageFour(props) {
  return (
    <div>
      <div className = "progressBarWords">
        <p className = "coloredBlue">REVENUES</p>
        <p className = "coloredBlue">EXPENSES</p>
        <p className = "coloredBlue">COMPARE</p>
      </div>
      <ProgressBar3/>
       <h4>RESULTS</h4>
      <h3 className = "latePageHeader">Your Expenses Guess</h3>
      <div className = "centerPie">
      <PieChartFunctional className="pieCenter" name="pie5" data={props.expenditures} />
      </div>
      <h3 className = "latePageHeader">Your Actual Expenses</h3>
      <div className = "centerPie">
      <PieChartFunctional className="pieCenter" name="pie6" data={props.actualExpenditures} />
      </div>
      <div className="buttonDiv">
        <button type="button" className="pageButton" className="restartButton" onClick={props.resetPage}> Restart </button>
      </div>
    </div>
  );
}

/* A default, in case something goes wrong loading the pages */
function PageHolder(props) {
  let revenue = props.revenue;
  let revenueInfo = props.revenueInfo;
  let changeRevenue = props.changeRevenue;
  let expenditures = props.expenditures;
  let expenditureInfo = props.expenditureInfo;
  let changeExpenditures = props.changeExpenditures;
  let actualRevenue = props.actualRevenue;
  let actualExpenditures = props.actualExpenditures;
  let page = props.page;
  let revenuePercent = props.revenuePercent;
  let expenditurePercent = props.expenditurePercent;

  let contents = <PageOne revenue={revenue} revenueInfo={revenueInfo} changeRevenue={changeRevenue} pageUp={props.pageUp} pageBack={props.pageBack} revenuePercent= {revenuePercent} expenditurePercent = {expenditurePercent}/>
  if (page == 1) {
    contents = <PageTwo expenditures={expenditures} expenditureInfo={expenditureInfo} changeExpenditures={changeExpenditures} pageUp={props.pageUp} pageBack={props.pageBack} revenuePercent= {revenuePercent} expenditurePercent = {expenditurePercent}/>
  } else if (page == 2) {
    contents = <PageThree revenue={revenue} actualRevenue={actualRevenue} pageUp={props.pageUp} pageBack={props.pageBack} />
  } else if (page == 3) {
    contents = <PageFour expenditures={expenditures} actualExpenditures={actualExpenditures} pageUp={props.pageUp} pageBack={props.pageBack} resetPage = {props.resetPage}/>
  }

  return (<div className="Pageholder">{contents}</div>);
}

/* Progress bar fors the first page, the revenues guess page */
function ProgressBar1 (props) {
  let stageOne = props.stageOne;
  let stageTwo = props.stageTwo;
  let stageThree = props.stageThree;

  return (
    <div className="container">
          <ul className="progressbar">
            <li className = "active"></li>
            <li></li>
            <li></li>
          </ul>
      </div>
  );  
}

/* Progress bar fors the first page, the revenues guess page */
function ProgressBar2 (props) {
  let stageOne = props.stageOne;
  let stageTwo = props.stageTwo;
  let stageThree = props.stageThree;

  return (
    <div className="container">
          <ul className="progressbar">
            <li id = "bar2Item1" className = "active"></li>
            <li id = "bar2Item2" className = "active"></li>
            <li></li>
          </ul>
      </div>
  );  
}

/* Progress bar fors the first page, the revenues guess page */
function ProgressBar3 (props) {
  let stageOne = props.stageOne;
  let stageTwo = props.stageTwo;
  let stageThree = props.stageThree;

  return (
    <div className="container">
          <ul className="progressbar">
            <li id = "bar3Item1" className = "active"></li>
            <li id = "bar3Item2" className = "active"></li>
            <li id = "bar3Item3" className = "active"></li>
          </ul>
      </div>
  );  
}

/* Circle Svg Creation */
function Circle(props) {
  return (<svg height="21" width="25">
    <circle cx="7" cy="10" r="7" stroke="black" strokeWidth="0" fill={props.color} />
  </svg>);
}

/* App */
function App() {

  // initialization, which given values for the actual numbers
  let actualRevenue = [
    { name: 'Medical Center', value: 45, color: '#f0bf00' },
    { name: 'Student Fees', value: 4, color: '#f6e50e' },
    { name: 'State of California', value: 8, color: '#fff688' },
    { name: 'Tuition', value: 11, color: '#5F63EC' },
    { name: 'Research Grants and Contracts', value: 13, color: '#71A8FF' },
    { name: 'Pell Grants', value: 1, color: '#0F7AB4' },
    { name: 'Non-Educational Services', value: 11, color: '#D4E4FF' },
    { name: 'Gifts, Endowments, Interest, etc', value: 7, color: '#FFFFFF' }

  ];

  let actualExpenditures = [
    { name: 'Medical Center', value: 43, color: '#e3A400' },
    { name: 'Teaching and Teaching Support', value: 23, color: '#f0bf00' },
    { name: 'Research', value: 11, color: '#f6e50e' },
    { name: 'Student Services and Finacial Aid', value: 8, color: '#fff688' },
    { name: 'Operations and Maintenance (Buildings, etc)', value: 2, color: '#5F63EC' },
    { name: 'Administration', value: 3, color: '#71A8FF' },
    { name: 'Non-Educational Services', value: 2, color: '#0F7AB4' },
    { name: 'Public Service', value: 2, color: '#D4E4FF' },
    { name: 'Depreciation, Interest, etc.', value: 6, color: '#FFFFFF' }

  ];

  const [revenue, updateRevenue] = React.useState([
    { name: 'Medical Center', value: "", color: '#f0bf00', percent: "" },
    { name: 'Student Fees', value: "", color: '#f6e50e', percent: "" },
    { name: 'State of California', value: "", color: '#fff688', percent: "" },
    { name: 'Tuition', value: "", color: '#5F63EC', percent: "" },
    { name: 'Research Grants and Contracts', value: "", color: '#71A8FF', percent: "" },
    { name: 'Pell Grants', value: "", color: '#0F7AB4', percent: "" },
    { name: 'Non-Educational Services', value: "", color: '#D4E4FF', percent: "" },
    { name: 'Gifts, Endowments, Interest, etc', value: "", color: '#FFFFFF', percent: "" }

  ]);

  const [expenditures, updateExpenditures] = React.useState([
    { name: 'Medical Center', value: "", color: '#e3A400', percent: "" },
    { name: 'Teaching and Teaching Support', value: "", color: '#f0bf00', percent: "" },
    { name: 'Research', value: "", color: '#f6e50e', percent: "" },
    { name: 'Student Services and Finacial Aid', value: "", color: '#fff688', percent: "" },
    { name: 'Operations and Maintenance (Buildings, etc)', value: "", color: '#5F63EC', percent: "" },
    { name: 'Administration', value: "", color: '#71A8FF', percent: "" },
    { name: 'Non-Educational Services', value: "", color: '#0F7AB4', percent: "" },
    { name: 'Public Service', value: "", color: '#D4E4FF', percent: "" },
    { name: 'Depreciation, Interest, etc.', value: "", color: '#FFFFFF', percent: "" }

  ]);

  let resetRevenue = [
    { name: 'Medical Center', value: "", color: '#f0bf00', percent: "" },
    { name: 'Student Fees', value: "", color: '#f6e50e', percent: "" },
    { name: 'State of California', value: "", color: '#fff688', percent: "" },
    { name: 'Tuition', value: "", color: '#5F63EC', percent: "" },
    { name: 'Research Grants and Contracts', value: "", color: '#71A8FF', percent: "" },
    { name: 'Pell Grants', value: "", color: '#0F7AB4', percent: "" },
    { name: 'Non-Educational Services', value: "", color: '#D4E4FF', percent: "" },
    { name: 'Gifts, Endowments, Interest, etc', value: "", color: '#FFFFFF', percent: "" }

  ];
  let resetExpenditures = [
    { name: 'Medical Center', value: "", color: '#e3A400', percent: "" },
    { name: 'Teaching and Teaching Support', value: "", color: '#f0bf00', percent: "" },
    { name: 'Research', value: "", color: '#f6e50e', percent: "" },
    { name: 'Student Services and Finacial Aid', value: "", color: '#fff688', percent: "" },
    { name: 'Operations and Maintenance (Buildings, etc)', value: "", color: '#5F63EC', percent: "" },
    { name: 'Administration', value: "", color: '#71A8FF', percent: "" },
    { name: 'Non-Educational Services', value: "", color: '#0F7AB4', percent: "" },
    { name: 'Public Service', value: "", color: '#D4E4FF', percent: "" },
    { name: 'Depreciation, Interest, etc.', value: "", color: '#FFFFFF', percent: "" }

  ];

  const [page, updatePage] = React.useState(0);
  const [revenuePercent, updateRevPercent] = React.useState(0);
  const [expenditurePercent, updateExpPercent] = React.useState(0);


  /* Change the revenue circle when an input is made */
  function changeRevenue(index, value, totalPercent) {
    let temp = Number(totalPercent);
    updateRevPercent(temp);

    revenue[index].value = Number(value);
    revenue[index].percent = value.toString() + '%';
    console.log(revenue[index]);
    let tempRevenue = [];
    for (let i = 0; i < revenue.length; i++) {
      tempRevenue.push(revenue[i]);
    }
    updateRevenue(tempRevenue);
    console.log("totalPercent " , totalPercent);
    console.log("revenuePercent " , revenuePercent);
    console.log("changeRevenue.value", value)
    console.log("look at me ", revenue);
  }

  /* Change the expenditure circle when an input is made */
  function changeExpenditures(index, value, percent) {
    let temp = Number(percent);
    updateExpPercent(temp);

    expenditures[index].value = Number(value);
    console.log(expenditures[index]);
    expenditures[index].percent = value.toString() + '%';
    let tempExpenditures = [];
    for (let i = 0; i < expenditures.length; i++) {
      tempExpenditures.push(expenditures[i]);
    }
    updateExpenditures(tempExpenditures);
    console.log("look at me ", expenditures);
  }

  /* Set the values of inputs back to nothing, to play again */
  function resetPage() {
    updateRevenue(resetRevenue);
    updateExpenditures(resetExpenditures);
    updateRevPercent(0);
    updateExpPercent(0);
    updatePage(0);

  }

  /* move forward a page */
  function pageUp() {
    console.log("Step:", page);
    if (page >= 3) {
      let tempPage = 3;
      updatePage(tempPage)
    } else {
      let tempPage = page + 1;
      updatePage(tempPage);
    }
    console.log("To Step: ", page)
  }

  /* move back a page */
  function pageBack() {
    console.log("Going from Step:", page);
    if (page <= 0) {
      let tempPage = 0;
      updatePage(tempPage)
    } else {
      let tempPage = page - 1;
      updatePage(tempPage);
    }
    console.log("To Step: ", page)
  }





  /* Hardcoded information for the tooltip boxes) */
  let revenueInfo = ['A large, not-for-profit regional medical center, including multiple hospitals, labs and clinics. Income comes from patients, medical insurance companies, and government programs like medicare.', 
    'Fees are dedicated to specific services, such as athletic facilities, bus service (UNITRANS), student organizations, the CoHo and Student Community Center, etc.',
    'General funds given by the taxpayers of California, appropriated annualy by the state legislature. General funds are not dedicated to specific services.',
    'Students pay tuition to attend the University. Non-California residents pay about twice as much as residents.  Tuition is also general funds.',
    'Government and industry funds given to faculty and graduate students to perform research projects. These include up to 50% overhead in addition to the cost of the research.',
    "Federal grants for tuition and living expenses for low-income students. Percentage of students with Pell grants is a good way to measure who a University serves; at UCD, it's 34%; at Cal Tech it's 14%; at Sac State it's 71%.",
    "Services other than education that people pay for, like dorms, dining, parking, etc.  At UC Davis, this also includes almost $500M of revenue generated by medical school faculty, or 8%, making this category look really big.",
    "Endowments are past gifts that were invested to provide income; interest is earned on other savings. The Museum is the direct result of a $10M gift from Jan Shrem and Maria Manetti Shrem."]

  
  let expenditureInfo = ["The cost of providing care at the Medical Center is roughly what we get paid to provide it.", 
  "Professors, advisors, deans, the library, the computer labs, etc, including Medical School faculty salaries.", 
  "The costs of doing the research, mostly researcher salaries.", 
  "Student Health, things covered by fees, Admissions, and also financial aid from the general funds, which is about $100M or 1.5%.", 
  "Upkeep of the grounds and building, and utilities, which are less than 1%.", 
  "Provost and Chancellor's offices, raising money, accounting, personnel, legal, making budgets.", 
  "The costs of providing dorms, dining,parking, etc.", 
  "Mostly the cooperative extension, which provides agricultural services to farmers, ranchers, winemakers, etc.  Part of our mission as a land grant university.", 
  "Depreciation is the loss of value of buildings and equipment as they wear out. Mostly unavoidable financial losses."]

  const [pieData1, setPieData1] = useState(actualRevenue);

  console.log("rendering App");

  /*The code carrying this div, with progress bar down to buttons*/
  return (
    <div className ="parentDiv">
      <div id="text">
        <h1 id="header">Slice the Pie</h1>
        <p id="paragraph1" >Say you got to run the University. How much would you allocate to different sectors?  Learn about your funding sources, with a guessing game.</p>
        <br/>
        <p id="paragraph2">You make your choices by inputting percentages of each section of a pie chart.  See how well your choices match the ones the real Provost made.</p>
      </div>
      

      
      <PageHolder revenue={revenue} revenueInfo={revenueInfo} changeRevenue={changeRevenue} actualRevenue={actualRevenue} expenditures={expenditures} expenditureInfo={expenditureInfo} actualExpenditures={actualExpenditures} changeExpenditures = {changeExpenditures} page={page} pageUp={pageUp} pageBack={pageBack} resetPage = {resetPage} revenuePercent= {revenuePercent} expenditurePercent = {expenditurePercent}/>
    
    </div>
  )

}

export default App;


