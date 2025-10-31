import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="container">
        <h1>About EcoViz</h1>
        
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            EcoViz is dedicated to making climate change data accessible, understandable, and actionable. 
            We believe that by visualizing complex climate data in intuitive ways, we can help individuals, 
            educators, researchers, and policymakers better understand the challenges we face and make 
            informed decisions to address climate change.
          </p>
        </section>
        
        <section className="about-section">
          <h2>The Dashboard</h2>
          <p>
            Our Interactive Global Climate Change Dashboard provides a comprehensive view of climate data 
            from around the world. Users can explore temperature trends, CO2 levels, sea level rise, and 
            other key climate indicators across different regions and time periods. The dashboard features 
            interactive maps, charts, and visualizations that make it easy to see patterns and trends in 
            the data.
          </p>
        </section>
        
        <section className="about-section">
          <h2>Data Sources</h2>
          <p>
            We use data from reputable scientific organizations and research institutions, including:
          </p>
          <ul className="data-sources-list">
            <li>
              <strong>NASA Goddard Institute for Space Studies (GISS)</strong> - 
              Temperature data and climate models
            </li>
            <li>
              <strong>National Oceanic and Atmospheric Administration (NOAA)</strong> - 
              Climate data, sea level measurements, and atmospheric CO2 records
            </li>
            <li>
              <strong>World Bank Climate Change Knowledge Portal</strong> - 
              Regional climate data and projections
            </li>
            <li>
              <strong>Intergovernmental Panel on Climate Change (IPCC)</strong> - 
              Assessment reports and climate projections
            </li>
            <li>
              <strong>Global Carbon Project</strong> - 
              Carbon cycle data and emissions statistics
            </li>
          </ul>
        </section>
        
        <section className="about-section">
          <h2>Methodology</h2>
          <p>
            Our visualizations are based on peer-reviewed scientific data. We process and normalize the 
            data to ensure consistency across different sources and time periods. For some visualizations, 
            we use statistical methods to identify trends and patterns. All data processing methods are 
            documented and available upon request.
          </p>
        </section>
        
        <section className="about-section">
          <h2>The Team</h2>
          <p>
            EcoViz was created by a team of climate scientists, data visualization experts, and software 
            developers committed to advancing climate literacy and action. Our team members have backgrounds 
            in atmospheric science, environmental policy, data science, and web development.
          </p>
        </section>
        
        <section className="about-section">
          <h2>Contact Us</h2>
          <p>
            We welcome feedback, questions, and collaboration opportunities. Please reach out to us at 
            <a href="mailto:info@ecoviz.example.com"> info@ecoviz.example.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
