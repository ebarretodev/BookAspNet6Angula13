using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WorldCitiesApi.Data;
using WorldCitiesApi.Data.Models;
using WorldCitiesAPI.Controllers;

namespace WorldCitiesAPI.Tests;
public class CitiesController_Test
{
    private readonly ApplicationDbContext _context;
    private readonly CitiesController _controller;

    public CitiesController_Test()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())   
            .Options;
        _context = new ApplicationDbContext(options);

        _context.Add(new City()
        {
            Id = 1,
            Name = "TestCity",
            Lat = 1,
            Lon = 1,
            CountryId = 1
        });
        _context.SaveChanges();

        _controller = new CitiesController(_context);
    }

    /// <summary>
    /// Test the GetCity() method
    /// </summary>
    [Fact]
    public async Task ShouldReturnNotNull() {
        // Arrange
        City? city_existing = null;
        // Act
        city_existing = (await _controller.GetCity(1)).Value;
        // Assert
        Assert.NotNull(city_existing);
        
    }
    /// <summary>
    /// Test the GetCity() method
    /// </summary>
    [Fact]
    public async Task ShouldReturnNull()
    {
        // Arrange
        // todo: define the required assets
        City? city_notExisting = null;
        // Act
        // todo: invoke the test
        city_notExisting = (await _controller.GetCity(2)).Value;
        // Assert
        // todo: verify that conditions are met.
        Assert.Null(city_notExisting);
    }

}
