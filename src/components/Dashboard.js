import React from 'react';

function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="hero min-h-screen bg-base-100">
        <div className="container">
          <div className="hero-content flex-col lg:flex-row-reverse">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl font-bold">Andi Said Haidir Ali</h1>
              <p className="py-6">
              Dynamic and versatile part-time software developer with a passion for crafting innovative solutions. With a keen eye for detail and a drive for excellence, I specialize in Software development, DevOps engineer, Data Engineer, Server Maintenance Expertise, and Database Administrator, offering a diverse skill set to tackle a range of projects.
              </p>

            </div>
            <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100 lg:mr-10">
              <div className="">
                <img src="said.png"/>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;
